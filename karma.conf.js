const path = require("path");

// Configuración de Karma: ejecuta las pruebas Jasmine (tests/**/*.spec.jsx).
// webpack + babel convierten el JSX; jsdom simula el navegador (DOM) sin abrir ventanas.
module.exports = function (config) {
  config.set({
    frameworks: ["jasmine", "webpack"],
    files: [{ pattern: "tests/**/*.spec.jsx", watched: false }],
    preprocessors: { "tests/**/*.spec.jsx": ["webpack"] },

    webpack: {
      mode: "development",
      devtool: false,
      resolve: {
        extensions: [".js", ".jsx"],
        // Mock: en las pruebas, next/link se reemplaza por un <a> simple.
        alias: { "next/link": path.resolve(__dirname, "tests/mocks/NextLinkMock.jsx") },
      },
      module: {
        rules: [
          {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            use: {
              loader: "babel-loader",
              options: {
                presets: [
                  "@babel/preset-env",
                  ["@babel/preset-react", { runtime: "automatic" }],
                ],
                // Mide la cobertura del código (components/ y data/), no de los tests.
                plugins: [["istanbul", { exclude: ["tests/**", "**/*.spec.jsx", "**/NextLinkMock.jsx"] }]],
              },
            },
          },
        ],
      },
    },

    browsers: ["jsdom"],
    reporters: ["spec", "coverage"],
    coverageReporter: {
      dir: "coverage",
      reporters: [{ type: "text-summary" }, { type: "html" }, { type: "lcov" }],
    },
    singleRun: true,
  });
};
