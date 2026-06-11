/**
 * Input sanitization middleware to prevent XSS attacks
 */
const sanitizeHtml = (str) => {
  if (typeof str !== 'string') {
    return str;
  }

  return str
    // Remove script tags
    .replace(/<script[^>]*>([\S\s]*?)<\/script>/gi, '')
    // Remove inline event handlers (e.g. onload, onerror, onclick)
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    // Remove javascript: pseudo-protocol URIs
    .replace(/javascript:\s*[^"']*/gi, '');
};

const sanitizeInput = (req, res, next) => {
  if (req.body && typeof req.body === 'object') {
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        req.body[key] = sanitizeHtml(req.body[key]);
      } else if (Array.isArray(req.body[key])) {
        req.body[key] = req.body[key].map(item =>
          typeof item === 'string' ? sanitizeHtml(item) : item
        );
      }
    });
  }
  next();
};

module.exports = sanitizeInput;
