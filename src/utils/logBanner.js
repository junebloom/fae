import pkg from "../../package.json";

// Display a nice banner in the console
export default function logBanner() {
  const message = `%cfae ♥ ${pkg.version}%c https://github.com/${pkg.repository} `;

  if (globalThis.document) {
    // Style with CSS in browsers
    console.log(
      message,
      `
        background: #aaf;
        color: white;
        padding: 4px 10px;
        border-radius: 30px;
      `,
      "color: #aaf;"
    );
  } else {
    // Color with ANSI escape sequences in node
    console.log(
      message
        .replace(/%c/, "\x1B[35m\x1b[1m")
        .replace(/%c/, "\x1b[0m\x1b[35m") + "\x1b[0m"
    );
  }
}
