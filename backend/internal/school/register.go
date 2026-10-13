package school

import (
	_ "embed"
	"encoding/json"
	"strings"
)

//go:embed seed.json
var seedJSON []byte

// DevPassword is the shared development password for every seeded account.
// It is not a production identity provider.
const DevPassword = "school"

type Account struct {
	ID          string   `json:"id"`
	Name        string   `json:"name"`
	Email       string   `json:"email"`
	Role        string   `json:"role"`
	Status      string   `json:"status"`
	ClassIDs    []string `json:"classIds"`
	StudentIDs  []string `json:"studentIds"`
	StaffNumber string   `json:"staffNumber"`
}

type Year struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}

type Term struct {
	ID     string `json:"id"`
	YearID string `json:"yearId"`
	Name   string `json:"name"`
	Start  string `json:"start"`
	End    string `json:"end"`
}

type Class struct {
	ID        string `json:"id"`
	Name      string `json:"name"`
	Level     string `json:"level"`
	TeacherID string `json:"teacherId"`
	Capacity  int    `json:"capacity"`
	Room      string `json:"room"`
}

type Guardian struct {
	ID      string `json:"id"`
	Name    string `json:"name"`
	Phone   string `json:"phone"`
	Email   string `json:"email"`
	Address string `json:"address"`
}

type Link struct {
	ID           string `json:"id"`
	StudentID    string `json:"studentId"`
	GuardianID   string `json:"guardianId"`
	Relationship string `json:"relationship"`
	Billing      bool   `json:"billing"`
	Pickup       bool   `json:"pickup"`
	Emergency    bool   `json:"emergency"`
}

type Student struct {
	ID               string `json:"id"`
	StudentNumber    string `json:"studentNumber"`
	FirstName        string `json:"firstName"`
	MiddleName       string `json:"middleName"`
	LastName         string `json:"lastName"`
	PreferredName    string `json:"preferredName"`
	DateOfBirth      string `json:"dateOfBirth"`
	Gender           string `json:"gender"`
	Status           string `json:"status"`
	Address          string `json:"address"`
	Nationality      string `json:"nationality"`
	EnrolledOn       string `json:"enrolledOn"`
	WithdrawalReason string `json:"withdrawalReason"`
}

type Enrollment struct {
	ID             string  `json:"id"`
	StudentID      string  `json:"studentId"`
	ClassID        string  `json:"classId"`
	AcademicYearID string  `json:"academicYearId"`
	Start          string  `json:"start"`
	End            *string `json:"end"`
}

type Application struct {
	ID              string `json:"id"`
	Number          string `json:"number"`
	IntakeID        string `json:"intakeId"`
	ApplyingClassID string `json:"applyingClassId"`
	FirstName       string `json:"firstName"`
	LastName        string `json:"lastName"`
	Status          string `json:"status"`
	GuardianID      string `json:"guardianId"`
	CreatedAt       string `json:"createdAt"`
}

type InvoiceLine struct {
	Quantity  int `json:"quantity"`
	UnitPrice int `json:"unitPrice"`
}

type Invoice struct {
	ID        string        `json:"id"`
	Number    string        `json:"number"`
	StudentID string        `json:"studentId"`
	TermID    string        `json:"termId"`
	Lines     []InvoiceLine `json:"lines"`
	Discount  int           `json:"discount"`
	DueDate   string        `json:"dueDate"`
	Status    string        `json:"status"`
}

type Allocation struct {
	InvoiceID string `json:"invoiceId"`
	Amount    int    `json:"amount"`
}

type Payment struct {
	ID          string       `json:"id"`
	Number      string       `json:"number"`
	StudentID   string       `json:"studentId"`
	Amount      int          `json:"amount"`
	Method      string       `json:"method"`
	ReceivedOn  string       `json:"receivedOn"`
	Allocations []Allocation `json:"allocations"`
}

type Notice struct {
	ID       string `json:"id"`
	Title    string `json:"title"`
	Body     string `json:"body"`
	At       string `json:"at"`
	Read     bool   `json:"read"`
	Audience string `json:"audience"`
}

type CalendarItem struct {
	ID     string `json:"id"`
	Title  string `json:"title"`
	Date   string `json:"date"`
	Kind   string `json:"kind"`
	TermID string `json:"termId"`
}

type Register struct {
	Accounts     []Account      `json:"accounts"`
	Years        []Year         `json:"years"`
	Terms        []Term         `json:"terms"`
	Classes      []Class        `json:"classes"`
	Guardians    []Guardian     `json:"guardians"`
	Links        []Link         `json:"links"`
	Students     []Student      `json:"students"`
	Enrollments  []Enrollment   `json:"enrollments"`
	Applications []Application  `json:"applications"`
	Invoices     []Invoice      `json:"invoices"`
	Payments     []Payment      `json:"payments"`
	Notices      []Notice       `json:"notices"`
	Calendar     []CalendarItem `json:"calendar"`
}

func Load() (*Register, error) {
	var register Register
	if err := json.Unmarshal(seedJSON, &register); err != nil {
		return nil, err
	}
	return &register, nil
}

func (r *Register) AccountByEmail(email string) *Account {
	needle := strings.ToLower(strings.TrimSpace(email))
	for i := range r.Accounts {
		if strings.ToLower(r.Accounts[i].Email) == needle {
			return &r.Accounts[i]
		}
	}
	return nil
}

func (r *Register) ClassName(id string) string {
	for _, class := range r.Classes {
		if class.ID == id {
			return class.Name
		}
	}
	return "Unassigned"
}

func (r *Register) CurrentClassID(studentID, yearID string) string {
	for _, enrollment := range r.Enrollments {
		if enrollment.StudentID == studentID && enrollment.AcademicYearID == yearID && enrollment.End == nil {
			return enrollment.ClassID
		}
	}
	return ""
}

func (r *Register) VisibleStudents(user Account, yearID string) []Student {
	var rows []Student
	for _, student := range r.Students {
		if !r.canSee(user, student.ID, yearID) {
			continue
		}
		rows = append(rows, student)
	}
	if rows == nil {
		return []Student{}
	}
	return rows
}

func (r *Register) canSee(user Account, studentID, yearID string) bool {
	switch user.Role {
	case "parent", "student":
		return contains(user.StudentIDs, studentID)
	case "teacher":
		return contains(user.ClassIDs, r.CurrentClassID(studentID, yearID))
	default:
		return true
	}
}

func (r *Register) Outstanding(termID string, studentIDs []string) int {
	total := 0
	for _, invoice := range r.Invoices {
		if invoice.Status != "issued" || invoice.TermID != termID {
			continue
		}
		if studentIDs != nil && !contains(studentIDs, invoice.StudentID) {
			continue
		}
		charged := 0
		for _, line := range invoice.Lines {
			charged += line.Quantity * line.UnitPrice
		}
		charged -= invoice.Discount
		if charged < 0 {
			charged = 0
		}
		allocated := 0
		for _, payment := range r.Payments {
			for _, allocation := range payment.Allocations {
				if allocation.InvoiceID == invoice.ID {
					allocated += allocation.Amount
				}
			}
		}
		total += charged - allocated
	}
	return total
}

func contains(values []string, needle string) bool {
	for _, value := range values {
		if value == needle {
			return true
		}
	}
	return false
}
