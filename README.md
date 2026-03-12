# Group5 – Web Application Project

## 1. Project Overview

Group5 is a collaborative web development project created as part of a team-based software engineering workflow. The objective of the project is to design, implement, and maintain a modern web application while applying professional development practices such as version control, collaborative development, modular architecture, and integration with external services.

The repository contains the full source code of the application, including frontend components, configuration files, and integrations with external platforms such as Firebase. The system is structured to allow scalable development, clear separation of responsibilities, and maintainability over time.

The application provides a platform where users can interact with the system through a web interface, manage personal data, and interact with different services integrated into the platform.

This project emphasizes the following principles:

- Collaborative development using Git and GitHub
- Modular code structure
- Integration with external backend services
- User authentication and profile management
- Scalable project organization for team environments

The repository is maintained through the `develop` branch as the main integration branch where features are merged before being prepared for stable releases.

---

## 2. Project Objectives

The primary goals of the project are:

- To build a functional web application using modern web technologies.
- To implement authentication and user management systems.
- To integrate cloud services for storage and backend functionality.
- To establish a clear workflow for collaborative development.
- To maintain a well-organized and documented codebase.

The project also serves as a practical environment for applying software development methodologies typically used in real-world development teams.

---

## 3. Technology Stack

The project uses a modern web development stack composed of frontend technologies and cloud-based backend services.

### Frontend

The client-side interface is built using standard web technologies:

- HTML5
- CSS3
- JavaScript
- Modular component-based architecture

These technologies are used to create a responsive and interactive user interface that communicates with backend services.

### Backend Services

Instead of a traditional custom backend server, the application integrates cloud-based services:

- Firebase Authentication
- Firebase Storage
- Firebase project configuration

These services allow the application to handle authentication, file storage, and data operations without requiring a dedicated server infrastructure.

### Development Environment

The development process relies on the following tools:

- Git for version control
- GitHub for collaboration and repository management
- Node.js for dependency management and development tooling
- npm for installing and managing project dependencies
- Visual Studio Code as the recommended development environment

---

## 4. Repository Structure

The repository follows a modular structure that separates application logic, assets, and configuration files.

```
Group5
│
├── public/
│   Static files that are served directly by the application.
│   This may include images, icons, and other public assets.
│
├── src/
│   Main source code of the application.
│
│   ├── components/
│   Reusable interface components used across multiple pages.
│
│   ├── pages/
│   Main views or screens of the application.
│
│   ├── services/
│   Modules responsible for communication with external services
│   such as Firebase authentication or storage APIs.
│
│   ├── utils/
│   Utility functions and helper modules used across the project.
│
│   └── styles/
│   CSS or styling files used for layout and visual design.
│
├── config/
│   Configuration files related to the project environment.
│
├── package.json
│   Defines the project dependencies, scripts, and metadata.
│
└── README.md
    Documentation for the project.
```

This structure allows the project to scale while keeping the code organized and maintainable.

---

## 5. Installation and Setup

To run the project locally, follow these steps.

### Clone the repository

```
git clone https://github.com/Sykurlaust/Group5.git
```

### Navigate to the project directory

```
cd Group5
```

### Install dependencies

```
npm install
```

### Run the development environment

```
npm run dev
```

After starting the development server, the application will be available in the browser through the local development URL provided by the toolchain.

---

## 6. Environment Configuration

The application relies on environment variables to configure external services such as Firebase.

Create a `.env` file in the root directory of the project and include the required configuration variables.

Example configuration:

```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

These values must correspond to the Firebase project used by the application.

---

## 7. Development Workflow

The repository follows a collaborative Git workflow to manage code contributions.

Typical workflow:

1. Create a new feature branch from `develop`
2. Implement the feature or fix
3. Commit changes with descriptive commit messages
4. Push the branch to the remote repository
5. Create a Pull Request
6. Review and merge changes into the `develop` branch

This workflow ensures that new features are integrated in a controlled manner and allows multiple developers to collaborate simultaneously.

---

## 8. Key Functional Areas

The application focuses on several core functional areas:

### User Authentication

The system allows users to register and log in through Firebase Authentication. This ensures secure management of user accounts and session handling.

### Profile Management

Users can manage their profile information and upload profile images using Firebase Storage integration.

### Media Storage

The application supports uploading and retrieving user-generated content stored in the cloud.

### User Interface

The frontend interface is designed to be responsive and modular, allowing components to be reused throughout the application.

---

## 9. Future Improvements

Several improvements are planned for future iterations of the project:

- Implementation of automated testing
- Improved UI/UX design
- Performance optimization
- Expanded user functionality
- Deployment pipeline configuration
- Continuous integration setup

---

## 10. Contribution Guidelines

Contributions to the project should follow standard GitHub collaboration practices.

When contributing:

- Ensure code is clean and well structured
- Follow the established project architecture
- Document any new features or configuration requirements
- Submit changes through Pull Requests

---

## 11. License

This project is developed for educational and collaborative purposes.  
All contributors retain authorship of their respective contributions.
