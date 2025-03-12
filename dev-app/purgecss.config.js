module.exports = {
  content: ['./build/**/*.html', './build/static/js/**/*.js', './build/index.html'],
  css: ['./build/static/css/**/*.css'],
  safelist: [
    /--(\w+)/,           // CSS variables
    /^fa-/,              // Font Awesome classes
    /^leaflet-/,         // Leaflet map classes
    /^bootstrap/,        // Bootstrap classes
    /^btn/,              // Button classes
    /^nav/,              // Nav classes
    /^card/,             // Card classes
    /^modal/,            // Modal classes
    /^form/,             // Form classes
    /^react-/,           // React specific classes
    /^active$/,          // Common state classes
    /^disabled$/         // Common state classes
  ],
  output: './build/static/css/',
  keyframes: true,       // Keep keyframes
  fontFace: true,        // Keep font faces
  variables: true,       // Keep variables
  rejected: false,       // Don't output the rejected selectors
  rejectedCss: false     // Don't output the rejected CSS
}