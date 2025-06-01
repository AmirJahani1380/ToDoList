# Modern ToDo List Web Application

A clean, modern, and feature-rich ToDo List web application built with HTML, CSS, and JavaScript. This application provides a seamless task management experience with a beautiful user interface inspired by Google Tasks. 
you can visit it here: https://amirjahani1380.github.io/ToDoList/

## ✨ Features

- **Task Management**
  - Add new tasks with a clean input interface
  - Edit existing tasks
  - Delete individual tasks
  - Mark tasks as complete/incomplete with emoji indicators
  - Persistent storage using localStorage

- **Task Organization**
  - Filter tasks by status (All, Completed, Uncompleted)
  - Select multiple tasks for batch operations
  - Delete multiple selected tasks at once
  - Clear visual distinction between completed and uncompleted tasks

- **User Experience**
  - Modern, clean interface
  - Responsive design for all screen sizes
  - Smooth animations and transitions
  - Temporary confirmation messages for user actions
  - Hourly reminders for uncompleted tasks

- **Smart Features**
  - Task persistence across page refreshes
  - Keyboard shortcuts (Enter to add tasks)
  - Batch selection and deletion
  - Smart notifications for uncompleted tasks

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/AmirJahani1380/todo-list.git
   ```
2. Navigate to the project directory:
   ```bash
   cd todo-list
   ```
3. Open `index.html` in your web browser

## 💻 Usage

### Adding Tasks
- Type your task in the input field
- Press Enter or click the "Add Task" button

### Managing Tasks
- Click the ✅/⭕ emoji to toggle task completion
- Click the ✏️ button to edit a task
- Click the 🗑️ button to delete a task
- Use the filter buttons to view different task categories

### Batch Operations
- Use the "Select All" checkbox to select all tasks
- Select individual tasks using their checkboxes
- Click "Delete Selected" to remove multiple tasks

## 🎨 Customization

The application uses CSS variables for easy customization. You can modify the following in `style.css`:

```css
:root {
    --primary-color: #1a73e8;
    --primary-hover: #1557b0;
    --background-color: #f8f9fa;
    --card-background: #ffffff;
    --text-primary: #202124;
    --text-secondary: #5f6368;
    --border-color: #dadce0;
    --success-color: #34a853;
    --error-color: #ea4335;
}
```

## 🔧 Technical Details

- **Storage**: Uses browser's localStorage for data persistence
- **Responsive Design**: Adapts to all screen sizes
- **No Dependencies**: Pure HTML, CSS, and JavaScript
- **Modern JavaScript**: Uses ES6+ features
- **Error Handling**: Robust error handling for data operations


## 🙏 Acknowledgments

- Design inspired by Google Tasks
- Icons and emojis for task status indicators
- Modern UI/UX practices
