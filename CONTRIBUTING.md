# Contributing to DevSphere AI

Thank you for your interest in contributing to DevSphere AI! We welcome contributions from the community and are excited to work with you.

## Code of Conduct

Please note that this project is released with a [Contributor Code of Conduct](CODE_OF_CONDUCT.md). By participating in this project you agree to abide by its terms.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the issue list as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps which reproduce the problem** in as many details as possible
- **Provide specific examples to demonstrate the steps**
- **Describe the behavior you observed** after following the steps
- **Explain which behavior you expected to see instead and why**
- **Include screenshots and animated GIFs** if possible

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

- **Use a clear and descriptive title**
- **Provide a step-by-step description** of the suggested enhancement
- **Provide specific examples** to demonstrate the steps
- **Describe the current behavior** and **explain the expected behavior**
- **Explain why this enhancement would be useful**

### Pull Requests

- Fill in the required template
- Follow the JavaScript/React styleguides
- End all files with a newline
- Avoid platform-dependent code
- Document changes thoroughly
- Add appropriate tests when applicable

## Styleguides

### Git Commit Messages

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests liberally after the first line
- Consider starting the commit message with an applicable emoji:
  - 🎨 `:art:` when improving the format/structure of the code
  - ⚡ `:zap:` when improving performance
  - 📝 `:memo:` when writing docs
  - 🐛 `:bug:` when fixing a bug
  - ✨ `:sparkles:` when introducing a new feature
  - 🔒 `:lock:` when dealing with security
  - ⬆️ `:arrow_up:` when upgrading dependencies
  - ⬇️ `:arrow_down:` when downgrading dependencies
  - 🚀 `:rocket:` when deploying stuff

### JavaScript Styleguide

We follow the [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript).

Key principles:

- Use 2 spaces for indentation
- Use semicolons
- Use single quotes for strings
- Use const/let, not var
- Use arrow functions when appropriate
- Add JSDoc comments for complex functions

Example:

```javascript
/**
 * Calculate the sum of two numbers
 * @param {number} a - First number
 * @param {number} b - Second number
 * @returns {number} Sum of a and b
 */
const calculateSum = (a, b) => a + b;
```

### React Styleguide

- Use functional components with hooks
- One component per file
- Use meaningful component names
- Add prop types or TypeScript when complex
- Keep components focused and reusable

Example:

```javascript
import React from 'react';
import PropTypes from 'prop-types';

/**
 * Component description
 */
const MyComponent = ({ title, onClick }) => {
  return (
    <div onClick={onClick}>
      {title}
    </div>
  );
};

MyComponent.propTypes = {
  title: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default MyComponent;
```

### Testing Styleguide

- Write tests for new features
- Aim for at least 80% code coverage
- Use descriptive test names
- Group related tests with describe blocks

## Development Setup

### Prerequisites

- Node.js v18+
- MongoDB (local or Atlas)
- Ollama with pulled models

### Setup Steps

1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/devsphere-ai.git
   cd devsphere-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   cd devsphere-frontend && npm install && cd ..
   cd backend && npm install && cd ..
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start development servers**
   ```bash
   npm run dev:all
   ```

5. **Create a branch for your feature**
   ```bash
   git checkout -b feature/amazing-feature
   ```

## Making Changes

1. Make your changes in your branch
2. Run linting: `npm run lint`
3. Test your changes thoroughly
4. Commit with meaningful messages
5. Push to your fork
6. Create a Pull Request

## Pull Request Process

1. Update the README.md with details of changes if applicable
2. Update documentation for new features
3. Increase version numbers following [Semantic Versioning](https://semver.org/)
4. You may merge the Pull Request in once you have sign-off from one maintainer

## Code Review Process

- At least one review is required
- Address feedback promptly
- Be respectful and constructive in discussions
- Maintainers have final say on mergeable PRs

## Release Process

1. Update version in package.json
2. Update CHANGELOG
3. Create git tag
4. Push to main branch
5. Deploy to production

## Getting Help

- 💬 Ask questions in GitHub Discussions
- 📧 Email: support@devsphere.ai
- 📚 Check existing issues and discussions
- 🐛 Create detailed bug reports

## Recognition

Contributors will be recognized in:
- README.md contributors section
- GitHub contributors hall of fame
- Release notes for significant contributions

---

Thank you for contributing to DevSphere AI! 🚀
