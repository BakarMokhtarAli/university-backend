# 📱 Student API Documentation

This section documents the APIs used by authenticated student users (for mobile or web dashboard use).

---

## 🌍 Base URL

```
https://university-backend-y63d.onrender.com
```

---

## 🔐 Authentication

All endpoints **require authentication** using JWT.

Include this header in every authenticated request:

```
Authorization: Token <jwt_token>
```

---

## 🔑 POST Student Login

Authenticate a student using their `student_id` and password.

### ✅ Endpoint

```
POST /api/auth/studentlogin
```

### 📦 Request Body

| Field        | Type   | Required | Description              |
| ------------ | ------ | -------- | ------------------------ |
| `student_id` | String | ✅       | Unique ID of the student |
| `password`   | String | ✅       | Student's login password |

### 📬 Example Request

```json
{
  "student_id": "BMS250540",
  "password": "123"
}
```

### ✅ Success Response

```json
{
  "status": "success",
  "message": "Student logged in successfully",
  "student": {
    "_id": "6621bcde4a...",
    "fullName": "Asha Ahmed",
    "student_id": "BMS250540"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6..."
}
```

---

## 📘 GET Student Exam Results

Retrieve a student’s exam results with optional filters.

### ✅ Endpoint

```
GET /api/exam-results/student/:studentId
```

### 🔗 Path Parameters

| Param       | Type   | Required | Description               |
| ----------- | ------ | -------- | ------------------------- |
| `studentId` | String | ✅       | The student's Mongo `_id` |

### 🔍 Query Parameters (Optional)

| Param       | Type   | Description                                            |
| ----------- | ------ | ------------------------------------------------------ |
| `subject`   | String | Filter by subject ID                                   |
| `academic`  | String | Filter by academic year ID                             |
| `exam_type` | String | Filter by exam type (`cw1`, `cw2`, `midterm`, `final`) |

### 📬 Example Request

```
GET /api/exam-results/student/6621bcde4a?exam_type=midterm
Authorization: Token <jwt_token>
```

### ✅ Example Success Response

```json
{
  "status": "success",
  "count": 2,
  "data": [
    {
      "_id": "665fa1ab2...",
      "exam": {
        "_id": "664fc456d...",
        "exam_type": "midterm",
        "title": "Midterm 2025",
        "date": "2025-06-20T00:00:00.000Z"
      },
      "subject": {
        "_id": "SUB123",
        "subject_name": "Mathematics"
      },
      "class": {
        "_id": "CLASS789",
        "class_name": "Class A"
      },
      "marks": 28,
      "grade": "A",
      "remark": "Excellent",
      "createdAt": "2025-06-20T09:13:22.000Z"
    }
  ]
}
```

### ⚠️ Error Responses

| Status | Message                                |
| ------ | -------------------------------------- |
| 400    | `Student ID is required`               |
| 401    | `Unauthorized - Token missing/invalid` |
| 404    | `No exam results found`                |

---

## 📘 POST Get Student Attendance by Date Range

Retrieve a student’s attendance records between two dates, optionally filtered by subject.

### ✅ Endpoint

```
POST /api/attendance/student/date-range
```

### 📦 Request Body

| Field       | Type   | Required | Description               |
| ----------- | ------ | -------- | ------------------------- |
| `student`   | String | ✅       | The student’s `_id`       |
| `startDate` | String | ✅       | Start date (`YYYY-MM-DD`) |
| `endDate`   | String | ✅       | End date (`YYYY-MM-DD`)   |
| `subject`   | String | ❌       | Optional subject ID       |

### 📬 Example Request

```json
{
  "student": "6621bcde4a...",
  "startDate": "2025-06-01",
  "endDate": "2025-06-20",
  "subject": "SUB123"
}
```

### ✅ Example Success Response

```json
{
  "status": "success",
  "message": "Student attendance retrieved by date range",
  "student": {
    "id": "6621bcde4a...",
    "name": "Asha Ahmed",
    "id_number": "CIS25051"
  },
  "startDate": "2025-06-01T00:00:00.000Z",
  "endDate": "2025-06-20T23:59:59.999Z",
  "count": 5,
  "summary": {
    "total": 5,
    "present": 4,
    "absent": 0,
    "late": 1,
    "leave": 0
  },
  "attendances": [
    {
      "_id": "ATTEND1",
      "date": "2025-06-03T00:00:00.000Z",
      "status": "Present",
      "subject": {
        "name": "Mathematics",
        "code": "MATH101"
      },
      "class": {
        "name": "Class A"
      }
    }
  ]
}
```

### ⚠️ Error Responses

| Status | Message                                           |
| ------ | ------------------------------------------------- |
| 400    | `Student ID, startDate, and endDate are required` |
| 400    | `Invalid startDate format`                        |
| 400    | `startDate must be before endDate`                |
| 404    | `Student not found`                               |

---

## 🛠️ PATCH Update Student Profile

Update a student’s profile. This can include personal details, class, or profile image.

> ✅ Class update will automatically update the student's faculty.  
> ✅ Image upload requires `multipart/form-data`.

### ✅ Endpoint

```
PATCH /api/students/:id
```

### 🔗 Path Parameters

| Param | Type   | Required | Description                |
| ----- | ------ | -------- | -------------------------- |
| `id`  | String | ✅       | The Mongo `_id` of student |

### 📦 Request Body (JSON or FormData)

| Field      | Type   | Required | Description                   |
| ---------- | ------ | -------- | ----------------------------- |
| `class`    | String | ❌       | Will also auto-update faculty |
| `fullName` | String | ❌       | Update full name              |
| `email`    | String | ❌       | Update email                  |
| `image`    | File   | ❌       | Upload new profile image      |

### 📬 Example JSON Request

```json
{
  "fullName": "Asha I. Ahmed",
  "class": "661a2cfb3e..."
}
```

### ✅ Example Success Response

```json
{
  "status": "success",
  "message": "Student updated successfully",
  "student": {
    "_id": "6621bcde4a...",
    "fullName": "Asha I. Ahmed",
    "student_id": "CIS25051",
    "class": "661a2cfb3e...",
    "faculty": "60ff112233...",
    "image": "/uploads/asha.jpg"
  }
}
```

---

## 📘 GET All Academic Years

Retrieve a list of all academic years and their linked semester info.

### ✅ Endpoint

```
GET /api/academics
```

### 📬 Example Request

```http
GET /api/academics
Authorization: Token <jwt_token>
```

### ✅ Example Response

```json
{
  "status": "success",
  "results": 3,
  "data": [
    {
      "_id": "6630a1ab7...",
      "academic_id": "ACD2025",
      "academic_year": "2025-2026",
      "start_date": "2025-08-01T00:00:00.000Z",
      "end_date": "2026-06-30T00:00:00.000Z",
      "semester_id": {
        "_id": "SEM01",
        "name": "Semester 1"
      },
      "createdAt": "2025-03-22T12:29:00.000Z"
    }
  ]
}
```

### ⚠️ Error Responses

| Status | Message        |
| ------ | -------------- |
| 401    | `Unauthorized` |

---

## 📣 GET Announcements

Retrieve a list of announcements for students. You can optionally filter by `receiver`.

---

### 🔐 Authorization

This endpoint **requires authentication**.  
Use this header:


---

### ✅ Endpoint
```
GET /api/academics
```


---

### 🔍 Query Parameters (Optional)

| Param      | Type   | Description                                   |
|------------|--------|-----------------------------------------------|
| `receiver` | String | Filter by target audience (e.g., `student`, `all`) |

---

### 📬 Example Request

```http
GET /api/announcements?receiver=student
Authorization: Token <jwt_token>
```


---

### ✅ Success Response

```json
{
  "status": "success",
  "count": 2,
  "announcements": [
    {
      "_id": "665fcf...",
      "title": "Exam Reminder",
      "body": "Midterm exams start next week. Please check your schedule.",
      "receiver": "student",
      "createdAt": "2025-06-20T10:00:00.000Z"
    },
    {
      "_id": "665fce...",
      "title": "Maintenance Notice",
      "body": "The portal will be down for maintenance this Saturday.",
      "receiver": "student",
      "createdAt": "2025-06-18T09:30:00.000Z"
    }
  ]
}
```



### ⚠️ Error Responses

| Status | Message        |
| ------ | -------------- |
| 401    | `Unauthorized` |

---



