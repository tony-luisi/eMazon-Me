console.error("SyntaxError: {\n  \"name\": \"eMazon-Me\",\n  \"version\": \"1.0.0\",\n  \"description\": \"it's a real sweet app\",\n  \"main\": \"server.js\",\n  \"scripts\": {\n    \"start\": \"node server.js\",\n<<<<<<< HEAD\n    \"serve\": \"nodemon server.js\",\n    \"budo\": \"budo index.js -d --serve bundle.js --live\",\n    \"budoRawad\": \"budo rawad.js -d --serve bundle.js --live\",\n    \"budoScully\": \"budo scully.js -d --serve bundle.js --live\",\n    \"build\": \"browserify ./src/index.js > ./public/js/bundle.js\",\n    \"build:watch\": \"watchify ./src/index.js -o ./public/js/bundle.js\",\n    \"test\": \"browserify test.js | node | tap-spec\",\n    \"dist\": \"mkdir -p dist && bash -c 'cp *.{js,html,css,jpg,png} dist'\",\n    \"push\": \"gh-pages -d dist\",\n    \"deploy\": \"npm run build && npm run dist && npm run push\"\n=======\n    \"serve\": \"node server.js\"\n>>>>>>> addd7be70cb3cf5a43034289185e4e5f951f10aa\n  },\n  \"browserify\": {\n    \"transform\": [\n      \"babelify\"\n    ]\n  },\n  \"repository\": {\n    \"type\": \"git\",\n    \"url\": \"https://github.com/author/eMazon-Me\"\n  },\n  \"author\": \"author\",\n  \"license\": \"MIT\",\n  \"bugs\": {\n    \"url\": \"https://github.com/author/eMazon-Me/issues\"\n  },\n  \"homepage\": \"https://github.com/author/eMazon-Me\",\n  \"dependencies\": {\n    \"express\": \"^4.13.4\",\n    \"babel-preset-es2015\": \"^6.5.0\",\n    \"babel-preset-react\": \"^6.5.0\",\n    \"babelify\": \"^7.2.0\",\n    \"body-parser\": \"^1.15.0\",\n    \"browserify\": \"^13.0.0\",\n    \"budo\": \"^8.2.0\",\n    \"gh-pages\": \"^0.11.0\",\n    \"http\": \"0.0.0\",\n    \"path\": \"^0.12.7\",\n    \"react\": \"^15.0.1\",\n    \"react-dom\": \"^15.0.1\",\n    \"react-router\": \"^2.3.0\",\n    \"tap-spec\": \"^4.1.1\",\n    \"tape\": \"^4.5.1\",\n    \"uglifyify\": \"^3.0.1\",\n    \"watchify\": \"^3.7.0\"\n  },\n  \"devDependencies\": {\n  }\n}\n : Unexpected token <");