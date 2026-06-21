import { getDocumentationIntro } from "./content";

const app = document.querySelector<HTMLDivElement>("#app");

if (!app) {
  throw new Error("Missing #app container");
}

app.innerHTML = `
  <main>
    <h1>typescript-library-template docs</h1>
    <p>${getDocumentationIntro()}</p>
    <p>Start local docs with <code>pnpm -C docs run dev</code>.</p>
  </main>
`;
