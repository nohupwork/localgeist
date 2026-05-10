// Empty shim for Node.js builtins that are bundled by pi-agent-core
// but never executed in the browser context.
// Using alias (not external) so esbuild replaces the import instead of
// leaving a bare "node:*" specifier that violates Chrome CSP.
export const constants = {};
export const createInterface = () => {};
export const createReadStream = () => {};
export const createWriteStream = () => {};
export const access = () => Promise.resolve();
export const lstat = () => Promise.resolve(null);
export const mkdir = () => Promise.resolve();
export const mkdtemp = () => Promise.resolve("");
export const readdir = () => Promise.resolve([]);
export const rm = () => Promise.resolve();
export const readFile = () => Promise.resolve("");
export const realpath = () => Promise.resolve("");
export const writeFile = () => Promise.resolve();
export const appendFile = () => Promise.resolve();
export const randomBytes = () => Buffer.from([]);
export const randomUUID = () => "";
export const spawn = () => {};
export const tmpdir = () => "";
export const dirname = (..._parts) => "";
export const join = (..._parts) => "";
export const resolve = (..._parts) => "";
export const isAbsolute = () => false;
export default {};
