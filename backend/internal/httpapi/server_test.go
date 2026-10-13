package httpapi

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"littleroyals/backend/internal/school"
)

func TestLoginAndStudents(t *testing.T) {
	register, err := school.Load()
	if err != nil {
		t.Fatal(err)
	}
	handler := New(register).Handler()

	body := bytes.NewBufferString(`{"email":"grace.achieng@littleroyals.school","password":"school"}`)
	login := httptest.NewRequest(http.MethodPost, "/v1/login", body)
	login.Header.Set("Content-Type", "application/json")
	rec := httptest.NewRecorder()
	handler.ServeHTTP(rec, login)
	if rec.Code != http.StatusOK {
		t.Fatalf("login status %d: %s", rec.Code, rec.Body.String())
	}
	var session struct {
		Token string `json:"token"`
	}
	if err := json.Unmarshal(rec.Body.Bytes(), &session); err != nil {
		t.Fatal(err)
	}

	students := httptest.NewRequest(http.MethodGet, "/v1/students", nil)
	students.Header.Set("Authorization", "Bearer "+session.Token)
	rec = httptest.NewRecorder()
	handler.ServeHTTP(rec, students)
	if rec.Code != http.StatusOK {
		t.Fatalf("students status %d", rec.Code)
	}
	var payload struct {
		Students []map[string]any `json:"students"`
	}
	if err := json.Unmarshal(rec.Body.Bytes(), &payload); err != nil {
		t.Fatal(err)
	}
	if len(payload.Students) != 7 {
		t.Fatalf("expected 7 pupils, got %d", len(payload.Students))
	}
}

func TestParentScopeAndBadPassword(t *testing.T) {
	register, err := school.Load()
	if err != nil {
		t.Fatal(err)
	}
	if register.Outstanding("t3-2026", nil) != 840000 {
		t.Fatalf("outstanding = %d", register.Outstanding("t3-2026", nil))
	}
	handler := New(register).Handler()

	bad := httptest.NewRequest(http.MethodPost, "/v1/login", bytes.NewBufferString(`{"email":"mei.chen@gmail.com","password":"nope"}`))
	rec := httptest.NewRecorder()
	handler.ServeHTTP(rec, bad)
	if rec.Code != http.StatusUnauthorized {
		t.Fatalf("expected 401, got %d", rec.Code)
	}

	ok := httptest.NewRequest(http.MethodPost, "/v1/login", bytes.NewBufferString(`{"email":"mei.chen@gmail.com","password":"school"}`))
	rec = httptest.NewRecorder()
	handler.ServeHTTP(rec, ok)
	var session struct {
		Token string `json:"token"`
	}
	if err := json.Unmarshal(rec.Body.Bytes(), &session); err != nil {
		t.Fatal(err)
	}
	students := httptest.NewRequest(http.MethodGet, "/v1/students", nil)
	students.Header.Set("Authorization", "Bearer "+session.Token)
	rec = httptest.NewRecorder()
	handler.ServeHTTP(rec, students)
	var payload struct {
		Students []map[string]any `json:"students"`
	}
	if err := json.Unmarshal(rec.Body.Bytes(), &payload); err != nil {
		t.Fatal(err)
	}
	if len(payload.Students) != 1 || payload.Students[0]["id"] != "liam" {
		t.Fatalf("parent scope = %#v", payload.Students)
	}
}
