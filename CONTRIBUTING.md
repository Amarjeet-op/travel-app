# Contributing to Abhayam (अभयम्)

Thank you for your interest in contributing to Abhayam! This document outlines the process for contributing to this project.

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct. Please read it before contributing.

## How Can I Contribute?

### Reporting Bugs

If you find a bug, please open an issue on GitHub with:
- A clear, descriptive title
- Steps to reproduce the bug
- Expected behavior vs actual behavior
- Screenshots (if applicable)
- Your environment details

### Suggesting Features

We welcome feature suggestions! Before opening an issue:
- Check if the feature already exists
- Search for similar suggestions
- Clearly describe the feature and its use case
- Explain why this feature would be valuable

### Pull Requests

1. **Fork the Repository**
   ```bash
   git clone https://github.com/yourusername/abhayam.git
   cd abhayam
   ```

2. **Create a Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/bug-description
   ```

3. **Make Your Changes**
   - Follow the existing code style
   - Use TypeScript for all new code
   - Write meaningful commit messages

4. **Test Your Changes**
   ```bash
   # Run development server
   npm run dev
   
   # Run linting
   npm run lint
   
   # Run type checking
   npm run type-check
   ```

5. **Commit Your Changes**
   ```bash
   git add .
   git commit -m 'Add: Description of your changes'
   ```

6. **Push to GitHub**
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Open a Pull Request**
   - Fill in the PR template
   - Link any related issues
   - Provide a clear description of changes

## Development Guidelines

### Code Style

- Use **TypeScript** for all new code
- Follow the existing ESLint configuration
- Use **Prettier** for code formatting
- Keep components small and focused

### Git Commit Messages

- Use clear, descriptive messages
- Start with a verb: Add, Fix, Update, Remove, Refactor
- Keep the first line under 72 characters
- Reference issues when applicable

**Examples:**
```
Add: AI Safety Checker component
Fix: User authentication redirect issue
Update: Trip creation form validation
Remove: Unused Firebase dependencies
```

### Component Structure

```
src/components/
├── feature-name/
│   ├── FeatureName.tsx        # Main component
│   ├── FeatureNameCard.tsx    # Card variant
│   ├── FeatureNameForm.tsx    # Form component
│   └── index.ts              # Export all
```

### Testing

- Test new features thoroughly
- Check responsive design
- Verify accessibility
- Test edge cases

### Documentation

- Update README.md for any new features
- Add comments for complex logic
- Document API changes

## Project Structure

```
abhayam/
├── src/
│   ├── app/           # Next.js App Router
│   ├── components/   # React components
│   ├── lib/          # Utilities & configs
│   ├── hooks/        # Custom React hooks
│   ├── stores/       # Zustand stores
│   ├── types/        # TypeScript definitions
│   └── styles/       # Global styles
├── functions/        # Firebase Cloud Functions
├── public/           # Static assets
└── plan/            # Project documentation
```

## Getting Help

- Open an issue for questions
- Check the wiki for documentation
- Join our community discussions

## Attribution

Contributors will be credited in the README.md file.

---

<p align="center">Thank you for contributing to Abhayam! 🛡️</p>
