/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        base: {
          primary: "#1A1B25",
          secondary: "#2E4057",
        },
        primary: {
          50: "#EFD56B",
          100: "#EDCF5A",
          300: "#E9C535",
          500: "#E8C021",
          700: "#CAA616",
          900: "#A58812",
        },
        gray: {
          900: "#212121",
          500: "#707070",
          600: "#404040",
          100: "#EEEEEE",
        },
        red: {
          100: "#f7e1e1",
          900: "#C93B3B",
        },
        green: {
          900: "#01865F",
          500: "#21B15E",
          100: "#dff4ed",
        },
      },
    },
  },
  plugins: [],
};
