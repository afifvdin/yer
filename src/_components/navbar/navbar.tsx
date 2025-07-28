import { Export } from "./export/export";
import { Menu } from "./menu/menu";
import { Tagset } from "./tagset/tagset";

export function Navbar() {
  return (
    <div className="fixed top-0 left-0 grid w-screen grid-cols-[1fr_auto_1fr] content-center">
      <div className="p-2">
        <Menu />
      </div>
      <div className="self-center p-2">
        <Tagset />
      </div>
      <div className="self-center justify-self-end p-2">
        <Export />
      </div>
    </div>
  );
}
