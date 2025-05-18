# MonacoEditor

## 安装依赖

基于 `vite` 脚手架生成的 `react` 项目

```npm
npm install @monaco-editor/react monaco-editor monaco-yaml yaml-language-server
```

## 封装组件

```tsx
// MonacoEditor.tsx
import Editor, { loader, type Monaco } from '@monaco-editor/react';
import { configureMonacoYaml } from 'monaco-yaml';
import { useEffect, useState } from 'react';

import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker';
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker';
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';

// 自定义内容
import JsonObj from './format.json';

loader.config({
  paths: {
    'vs': '/monaco-editor/min/vs' // 根据实际情况调整路径，需要将 node_modules/monaco-editor 复制到 plulic 下
  }
});

type LangTypes = keyof typeof JsonObj

export default function MonacoEditor() {
  const defaultLang: LangTypes = 'html'
  const languageTypes = Object.keys(JsonObj) as LangTypes[]
  const [language, setLanguage] = useState<LangTypes>(defaultLang)
  const [value, setValue] = useState(JsonObj[defaultLang])

  useEffect(() => {
    // 确保仅在客户端运行
    if (typeof window !== 'undefined') {
      window.MonacoEnvironment = {
        getWorker(_, label) {
          if (label === 'json') {
            return new jsonWorker();
          }
          if (label === 'css' || label === 'scss' || label === 'less') {
            return new cssWorker();
          }
          if (label === 'html' || label === 'handlebars' || label === 'razor') {
            return new htmlWorker();
          }
          if (label === 'typescript' || label === 'javascript') {
            return new tsWorker();
          }
          if (label === 'yaml') {
            // ✅ Vite 专用 Worker 加载方式
            /* 需要在 src 创建 yaml.worker.js 文件，内容为：
            import 'monaco-yaml/yaml.worker.js'*/
            return new Worker(
              new URL('./yaml.worker.js', import.meta.url),
              { type: 'module' }
            );

          }
          return new editorWorker();
        },
      };
    }
  }, []);

  function handleEditorWillMount(monaco: Monaco) {
    configureMonacoYaml(monaco, {
      enableSchemaRequest: true,
      schemas: [
        {
          fileMatch: ['**/.prettierrc.*'],
          uri: 'https://json.schemastore.org/prettierrc.json'
        },
        {
          fileMatch: ['**/person.yaml'],
          schema: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
                description: 'The person’s display name'
              },
              age: {
                type: 'integer',
                description: 'How old is the person in years?'
              },
              occupation: {
                enum: ['Delivery person', 'Software engineer', 'Astronaut']
              }
            }
          },
          uri: 'https://github.com/remcohaszing/monaco-yaml#usage'
        }],
    });
  }

  const changeLang = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const lang = e.target.value as LangTypes;
    if (languageTypes.includes(lang)) {
      setLanguage(lang);
      setValue(JsonObj[lang]);
    }
  }
  return (
    <div style={{ border: '1px solid red' }}>
      <select id="fruit-select" value={language} onChange={changeLang}>
        {
          languageTypes.map(lang => <option key={lang} value={lang} >{lang}</option>)
        }
      </select>

      <Editor
        height="500px"
        language={language}
        value={value}
        options={{ lineNumbers: 'on', tabSize: 2 }}
        beforeMount={handleEditorWillMount}
        onValidate={(markers) => {
          markers.forEach((marker) => {
            console.error(`${language} 错误:`, marker.message);
          });
        }}
      />
    </div>
  );
}
```

## format.json 文件

```json
{
  "html": "<!DOCTYPE html>\n<html lang=\"zh-CN\">\n<head>\n  <meta charset=\"UTF-8\">\n  <title>示例页面</title>\n  <style>\n    body { font-family: sans-serif; background: #f5f5f5; padding: 20px; }\n    h1 { color: #333; }\n  </style>\n</head>\n<body>\n  <h1>欢迎访问示例页面</h1>\n  <p>这是一个 HTML 格式的字符串示例。</p>\n</body>\n</html>",
  "css": "body {\n  margin: 0;\n  padding: 0;\n  font-family: sans-serif;\n  background-color: #f0f0f0;\n}\n\nh1 {\n  color: #333;\n  text-align: center;\n  margin-top: 50px;\n}\n\np {\n  color: #666;\n  font-size: 16px;\n  line-height: 1.6;\n  max-width: 600px;\n  margin: 20px auto;\n}\n",
  "javascript": "document.addEventListener('DOMContentLoaded', () => {\n  const heading = document.createElement('h1');\n  heading.textContent = 'Hello, JavaScript!';\n  document.body.appendChild(heading);\n\n  const paragraph = document.createElement('p');\n  paragraph.textContent = '这是一个 JS 格式的字符串示例。';\n  document.body.appendChild(paragraph);\n});",
  "typescript": "type User = {\n  id: number;\n  name: string;\n  email?: string;\n};\n\nfunction greet(user: User): string {\n  return `Hello, ${user.name}!`;\n}\n\nconst user: User = {\n  id: 1,\n  name: 'Alice'\n};\n\nconsole.log(greet(user));",
  "json": "{\n  \"version\": \"1.0\",\n  \"services\": {\n    \"web\": {\n      \"image\": \"node:18\",\n      \"ports\": [\n        \"3000:3000\"\n      ],\n      \"volumes\": [\n        \".:/app\"\n      ],\n      \"working_dir\": \"/app\",\n      \"command\": [\n        \"npm\",\n        \"start\"\n      ],\n      \"environment\": {\n        \"NODE_ENV\": \"development\"\n      }\n    },\n    \"db\": {\n      \"image\": \"postgres:14\",\n      \"restart\": \"always\",\n      \"environment\": {\n        \"POSTGRES_USER\": \"user\",\n        \"POSTGRES_PASSWORD\": \"password\",\n        \"POSTGRES_DB\": \"mydb\"\n      }\n    }\n  }\n}",
  "yaml": "version: '1.0'\nservices:\n  web:\n    image: node:18\n    ports:\n      - '3000:3000'\n    volumes:\n      - .:/app\n    working_dir: /app\n    command: ['npm', 'start']\n    environment:\n      - NODE_ENV=development\n  db:\n    image: postgres:14\n    restart: always\n    environment:\n      POSTGRES_USER: user\n      POSTGRES_PASSWORD: password\n      POSTGRES_DB: mydb"
}
```

## 其他

- 在 `src` 目录下新建`yaml.worker.js`文件，内容如下

```js
import 'monaco-yaml/yaml.worker.js'
```

- 需要将 `node_modules/monaco-editor` 复制到 `plulic/monaco-editor` 下
