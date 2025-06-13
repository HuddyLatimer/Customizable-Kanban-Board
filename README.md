# Customizable Kanban Board

A modern, customizable Kanban board web application that helps you organize tasks with a beautiful drag-and-drop interface. Built with vanilla JavaScript for optimal performance and simplicity.

![Kanban Board Preview](preview.png)

## Features

- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Customizable Task Colors**: Label tasks with different colors for better organization
- **Drag & Drop**: Intuitive drag-and-drop interface for task management
- **Persistent Storage**: Tasks automatically save to localStorage
- **Three-Column Layout**: Organize tasks in "To Do", "In Progress", and "Done" columns
- **Edit & Delete**: Easily modify or remove tasks
- **Modern UI**: Clean, modern interface with smooth animations
- **Secure**: HTML content is properly escaped to prevent XSS attacks


## How to Use

1. **Adding Tasks**
   - Click the "+" button in any column
   - Enter task title and description
   - Select a color label (optional)
   - Click "Add Task" or press Enter

2. **Moving Tasks**
   - Drag and drop tasks between columns
   - Tasks automatically save their new position

3. **Editing Tasks**
   - Click the edit (pencil) icon on any task
   - Modify the title, description, or color
   - Click "Save" or press Enter

4. **Deleting Tasks**
   - Click the delete (trash) icon
   - Confirm deletion in the modal

## Customization

The app uses CSS variables for easy customization. Edit the `:root` section in `styles.css` to modify:

- Color scheme
- Spacing
- Animations
- Border radius
- Shadows
- Typography

Example:
```css
:root {
    --primary-color: #2196f3;
    --danger-color: #f44336;
    --text-primary: #333333;
    /* ... other variables ... */
}
```

## Technical Details

- Built with vanilla JavaScript - no frameworks required
- Uses the HTML5 Drag and Drop API
- Implements modern CSS features:
  - CSS Grid
  - Flexbox
  - CSS Variables
  - Transitions & Animations
- Responsive design using media queries
- Local storage for data persistence

## Security Features

- HTML content is escaped to prevent XSS attacks
- Input validation for all form fields
- Secure drag and drop implementation

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Android Chrome)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Bug Reports

If you discover any bugs, please create an issue in the GitHub repository.

## Acknowledgments

- Inspired by Trello and other Kanban board implementations
- Icons from [Font Awesome](https://fontawesome.com/)
- Color scheme inspired by Material Design 
