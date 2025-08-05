# CompanionAI - Your AI Therapy Companions

A secure, privacy-focused website where people can interact with AI companions designed for emotional support and therapy-like conversations.

## 🔒 Security Features

### Top-Tier Security Implementation

**Content Security Policy (CSP)**
- Strict CSP headers prevent XSS attacks
- Only allows trusted sources for scripts, styles, and fonts
- Blocks inline scripts and unsafe eval() functions

**Input Validation & Sanitization**
- All user inputs are sanitized to prevent XSS attacks
- HTML tag filtering (only allows safe tags: br, strong, em, p)
- Maximum message length limits (1000 characters)
- Rate limiting (20 messages per minute)

**XSS Prevention**
- Comprehensive input sanitization
- HTML entity escaping
- Malicious pattern detection
- Script tag removal

**Privacy Protection**
- Zero data storage - all conversations processed locally
- No cookies or tracking mechanisms
- Automatic data clearing on page unload
- Client-side only processing

**Browser Security**
- Disabled right-click context menu in production
- Blocked developer tools access (F12, Ctrl+Shift+I)
- Prevented view source access (Ctrl+U)
- Secure favicon with lock emoji

**Visual Security Indicators**
- Security status badges on chat interface
- Lock icons and secure connection indicators
- Real-time security alerts for violations
- Rate limit warnings

## Features

### 🤖 Multiple AI Companions
- **Sarah** - The Empathetic Listener: Specializes in active listening and emotional validation
- **Marcus** - The Motivational Coach: Helps with goal setting and confidence building
- **Luna** - The Mindfulness Guide: Focuses on meditation and stress reduction
- **Alex** - The Practical Problem Solver: Assists with practical challenges and solutions

### 💬 Interactive Chat Interface
- Real-time chat with typing indicators
- Message suggestions for common topics
- Keyboard shortcuts (Escape to close, Ctrl/Cmd+K to start)
- Auto-resizing textarea
- Message history (limited to 50 messages for memory management)

### 🎨 Modern Design
- Responsive design that works on all devices
- Beautiful gradients and smooth animations
- Accessibility-focused with proper ARIA labels
- Dark/light theme compatibility

### 🛡️ Safety & Privacy Focus
- Clear disclaimers about service limitations
- Emergency resources prominently displayed
- Privacy-first approach with no data collection
- Security alerts and validation feedback

## Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No server or installation required

### Installation
1. Download all files to a local directory
2. Open `index.html` in your web browser
3. Start chatting with AI companions immediately

### Usage
1. **Choose a Companion**: Browse the companions section and select one that fits your needs
2. **Start Chatting**: Click "Chat with [Name]" or use the "Start Chat" button for a random companion
3. **Use Suggestions**: Click suggestion buttons for quick conversation starters
4. **Keyboard Shortcuts**:
   - `Escape` - Close chat
   - `Ctrl/Cmd + K` - Open chat with random companion
   - `Enter` - Send message
   - `Shift + Enter` - New line

## Design Features

### Color Scheme
- Primary: Blue gradients (#6366f1 to #8b5cf6)
- Secondary: Green accents (#10b981)
- Warning: Orange (#f59e0b)
- Error: Red (#dc2626)
- Neutral: Gray scale (#f3f4f6 to #374151)

### Typography
- **Font**: Inter (Google Fonts) - Clean, modern, highly readable
- **Weights**: 300, 400, 500, 600, 700
- **Icons**: Font Awesome 6.0

### Animations
- Smooth fade-in effects for cards
- Typing indicators with animated dots
- Hover effects on interactive elements
- Slide-in animations for security alerts

## Responsive Design

The website is fully responsive and optimized for:
- **Desktop**: Full feature set with side-by-side layouts
- **Tablet**: Adjusted spacing and touch-friendly buttons
- **Mobile**: Hamburger menu, stacked layouts, optimized touch targets

### Mobile-Specific Features
- Touch-friendly button sizes
- Swipe gestures for navigation
- Optimized chat interface for small screens
- Mobile-optimized security alerts

## Technical Details

### File Structure
```
companionai/
├── index.html          # Main HTML file
├── styles.css          # CSS styles and animations
├── script.js           # JavaScript functionality
└── README.md           # This documentation
```

### Technologies Used
- **HTML5**: Semantic markup and accessibility
- **CSS3**: Flexbox, Grid, animations, responsive design
- **JavaScript ES6+**: Modern JavaScript with security features
- **Font Awesome**: Icons and visual elements
- **Google Fonts**: Typography

### Browser Support
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## Safety & Ethics

### Important Disclaimers
⚠️ **This is NOT a replacement for professional mental health care**

- CompanionAI is designed for emotional support and companionship only
- It cannot provide medical advice, diagnosis, or treatment
- If you're experiencing a mental health crisis, please contact emergency services

### Emergency Resources
- **National Suicide Prevention Lifeline**: 988
- **Crisis Text Line**: Text HOME to 741741
- **Emergency Services**: 911

### Privacy Policy
- **Zero Data Collection**: No personal information is collected or stored
- **Local Processing**: All conversations are processed in your browser
- **No Tracking**: No cookies, analytics, or tracking mechanisms
- **Automatic Cleanup**: Data is cleared when you close the page

## Use Cases

### ✅ Suitable For
- General emotional support and companionship
- Stress relief and relaxation
- Motivation and goal setting
- Mindfulness and meditation guidance
- Practical problem-solving assistance

### ❌ Not Suitable For
- Medical or mental health diagnosis
- Crisis intervention
- Professional therapy replacement
- Emergency situations
- Legal or financial advice

## Security Best Practices

### For Users
1. **Keep Browser Updated**: Use the latest version of your browser
2. **Enable Security Features**: Keep browser security settings enabled
3. **Use HTTPS**: Always access over secure connections
4. **Clear Data**: Clear browser data after sensitive conversations
5. **Report Issues**: Report any security concerns immediately

### For Developers
1. **Regular Updates**: Keep dependencies updated
2. **Security Audits**: Regular security reviews
3. **Input Validation**: Always validate and sanitize inputs
4. **CSP Headers**: Implement strict Content Security Policies
5. **Rate Limiting**: Prevent abuse and spam

## Future Enhancements

### Planned Features
- User accounts with secure authentication
- Voice chat capabilities
- Mood tracking and analytics
- Customizable companion personalities
- Group chat sessions
- Export conversation history
- Advanced privacy controls

### Security Improvements
- End-to-end encryption for stored data
- Two-factor authentication
- Advanced threat detection
- Security audit logging
- Penetration testing integration

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### Security Contributions
- Report security vulnerabilities privately
- Follow responsible disclosure practices
- Include detailed reproduction steps
- Provide suggested fixes when possible

## Support

### Getting Help
- Check the FAQ section
- Review the documentation
- Contact support for technical issues
- Report bugs with detailed information

### Security Support
- Report security issues immediately
- Include browser and OS information
- Provide detailed error messages
- Describe steps to reproduce

---

**Remember**: Your mental health matters. If you're struggling, please reach out to professional help. CompanionAI is here to support you, but it's not a substitute for professional care.

🔒 **Built with security and privacy as top priorities** 