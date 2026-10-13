package httpapi

import (
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"net/http"
	"strings"
	"sync"

	"littleroyals/backend/internal/school"
)

type Server struct {
	register *school.Register
	mu       sync.Mutex
	tokens   map[string]school.Account
}

func New(register *school.Register) *Server {
	return &Server{register: register, tokens: map[string]school.Account{}}
}

func (s *Server) Handler() http.Handler {
	mux := http.NewServeMux()
	mux.HandleFunc("GET /v1/health", s.health)
	mux.HandleFunc("POST /v1/login", s.login)
	mux.HandleFunc("GET /v1/dashboard", s.dashboard)
	mux.HandleFunc("GET /v1/students", s.students)
	mux.HandleFunc("GET /v1/students/{id}", s.student)
	mux.HandleFunc("GET /v1/applications", s.applications)
	mux.HandleFunc("GET /v1/classes", s.classes)
	return withCORS(mux)
}

func (s *Server) health(w http.ResponseWriter, _ *http.Request) {
	writeJSON(w, http.StatusOK, map[string]string{
		"service": "littleroyals",
		"status":  "ok",
	})
}

func (s *Server) login(w http.ResponseWriter, r *http.Request) {
	var body struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		writeError(w, http.StatusBadRequest, "Send an email and password.")
		return
	}
	account := s.register.AccountByEmail(body.Email)
	if account == nil {
		writeError(w, http.StatusUnauthorized, "No school account uses that email.")
		return
	}
	if account.Status != "active" {
		writeError(w, http.StatusUnauthorized, "This account is not active.")
		return
	}
	if body.Password != school.DevPassword {
		writeError(w, http.StatusUnauthorized, "Password is not correct.")
		return
	}
	token, err := newToken()
	if err != nil {
		writeError(w, http.StatusInternalServerError, "Could not start a session.")
		return
	}
	s.mu.Lock()
	s.tokens[token] = *account
	s.mu.Unlock()
	writeJSON(w, http.StatusOK, map[string]any{
		"token": token,
		"user":  publicUser(*account),
	})
}

func (s *Server) dashboard(w http.ResponseWriter, r *http.Request) {
	user, ok := s.user(r)
	if !ok {
		writeError(w, http.StatusUnauthorized, "Sign in again.")
		return
	}
	yearID := queryOr(r, "yearId", "ay-2026")
	termID := queryOr(r, "termId", "t3-2026")
	pupils := s.register.VisibleStudents(user, yearID)
	enrolled, watch := 0, 0
	ids := make([]string, 0, len(pupils))
	for _, pupil := range pupils {
		if pupil.Status != "active" && pupil.Status != "watch" {
			continue
		}
		enrolled++
		ids = append(ids, pupil.ID)
		if pupil.Status == "watch" {
			watch++
		}
	}
	var scoped []string
	if user.Role == "parent" || user.Role == "student" || user.Role == "teacher" {
		scoped = ids
	}
	termName := termID
	for _, term := range s.register.Terms {
		if term.ID == termID {
			termName = term.Name
		}
	}
	writeJSON(w, http.StatusOK, map[string]any{
		"school":       "Little Royals",
		"term":         termName,
		"enrolled":     enrolled,
		"watch":        watch,
		"applications": len(s.register.Applications),
		"outstanding":  s.register.Outstanding(termID, scoped),
		"currency":     "UGX",
		"source":       "development-register",
	})
}

func (s *Server) students(w http.ResponseWriter, r *http.Request) {
	user, ok := s.user(r)
	if !ok {
		writeError(w, http.StatusUnauthorized, "Sign in again.")
		return
	}
	yearID := queryOr(r, "yearId", "ay-2026")
	rows := []map[string]any{}
	for _, pupil := range s.register.VisibleStudents(user, yearID) {
		classID := s.register.CurrentClassID(pupil.ID, yearID)
		rows = append(rows, map[string]any{
			"id":            pupil.ID,
			"studentNumber": pupil.StudentNumber,
			"name":          strings.TrimSpace(pupil.FirstName + " " + pupil.LastName),
			"status":        pupil.Status,
			"className":     s.register.ClassName(classID),
			"enrolledOn":    pupil.EnrolledOn,
		})
	}
	writeJSON(w, http.StatusOK, map[string]any{"students": rows})
}

func (s *Server) student(w http.ResponseWriter, r *http.Request) {
	user, ok := s.user(r)
	if !ok {
		writeError(w, http.StatusUnauthorized, "Sign in again.")
		return
	}
	id := r.PathValue("id")
	yearID := queryOr(r, "yearId", "ay-2026")
	for _, pupil := range s.register.VisibleStudents(user, yearID) {
		if pupil.ID != id {
			continue
		}
		classID := s.register.CurrentClassID(pupil.ID, yearID)
		guardians := []map[string]any{}
		for _, link := range s.register.Links {
			if link.StudentID != pupil.ID {
				continue
			}
			for _, guardian := range s.register.Guardians {
				if guardian.ID == link.GuardianID {
					guardians = append(guardians, map[string]any{
						"name":         guardian.Name,
						"relationship": link.Relationship,
						"phone":        guardian.Phone,
						"billing":      link.Billing,
					})
				}
			}
		}
		writeJSON(w, http.StatusOK, map[string]any{
			"id":            pupil.ID,
			"studentNumber": pupil.StudentNumber,
			"name":          strings.TrimSpace(pupil.FirstName + " " + pupil.LastName),
			"status":        pupil.Status,
			"className":     s.register.ClassName(classID),
			"dateOfBirth":   pupil.DateOfBirth,
			"address":       pupil.Address,
			"enrolledOn":    pupil.EnrolledOn,
			"guardians":     guardians,
		})
		return
	}
	writeError(w, http.StatusNotFound, "That pupil is not in your scope.")
}

func (s *Server) applications(w http.ResponseWriter, r *http.Request) {
	user, ok := s.user(r)
	if !ok {
		writeError(w, http.StatusUnauthorized, "Sign in again.")
		return
	}
	if user.Role == "parent" || user.Role == "student" || user.Role == "teacher" {
		writeError(w, http.StatusForbidden, "Admissions are outside this role.")
		return
	}
	rows := []map[string]any{}
	for _, application := range s.register.Applications {
		rows = append(rows, map[string]any{
			"id":        application.ID,
			"number":    application.Number,
			"name":      application.FirstName + " " + application.LastName,
			"className": s.register.ClassName(application.ApplyingClassID),
			"status":    application.Status,
		})
	}
	writeJSON(w, http.StatusOK, map[string]any{"applications": rows})
}

func (s *Server) classes(w http.ResponseWriter, r *http.Request) {
	if _, ok := s.user(r); !ok {
		writeError(w, http.StatusUnauthorized, "Sign in again.")
		return
	}
	writeJSON(w, http.StatusOK, map[string]any{"classes": s.register.Classes})
}

func (s *Server) user(r *http.Request) (school.Account, bool) {
	header := r.Header.Get("Authorization")
	token := strings.TrimPrefix(header, "Bearer ")
	if token == "" || token == header {
		return school.Account{}, false
	}
	s.mu.Lock()
	defer s.mu.Unlock()
	account, ok := s.tokens[token]
	return account, ok
}

func publicUser(account school.Account) map[string]any {
	return map[string]any{
		"id":         account.ID,
		"name":       account.Name,
		"email":      account.Email,
		"role":       account.Role,
		"classIds":   account.ClassIDs,
		"studentIds": account.StudentIDs,
	}
}

func queryOr(r *http.Request, key, fallback string) string {
	if value := r.URL.Query().Get(key); value != "" {
		return value
	}
	return fallback
}

func newToken() (string, error) {
	buf := make([]byte, 16)
	if _, err := rand.Read(buf); err != nil {
		return "", err
	}
	return hex.EncodeToString(buf), nil
}

func writeJSON(w http.ResponseWriter, status int, body any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(body)
}

func writeError(w http.ResponseWriter, status int, message string) {
	writeJSON(w, status, map[string]string{"error": message})
}

func withCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Headers", "Authorization, Content-Type")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}
		next.ServeHTTP(w, r)
	})
}
