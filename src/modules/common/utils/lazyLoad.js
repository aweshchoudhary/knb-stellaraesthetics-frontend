import { lazy } from "react";

function lazyLoad(path, namedExport) {
  return lazy(() => {
    const promise = import(path);
    console.log(promise);
    if (namedExport === null) {
      return promise;
    } else {
      return promise.then((module) => ({ default: module[namedExport] }));
    }
  });
}

export default lazyLoad;
