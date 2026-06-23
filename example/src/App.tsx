import type { DemoEnvironment } from "./demoEnvironment";

type AppProps = Readonly<{
  demo: DemoEnvironment;
}>;

function App({ demo }: AppProps) {
  return <main>App {demo.mode}</main>;
}

export { App };
