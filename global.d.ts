interface Fn<T = any, R = T> {
  (...arg: T[]): R
}

interface PromiseFn<T = any, R = T> {
  (...arg: T[]): Promise<R>
}

type Nullable<T> = T | null

type Recordable<T = any> = Record<string, T>

interface ReadonlyRecordable<T = any> {
  readonly [key: string]: T
}

type LabelValueOptions = {
  label: string
  value: any
  [key: string]: string | number | boolean
}[]

type EmitType = (event: string, ...args: any[]) => void

interface ComponentElRef<T extends HTMLElement = HTMLDivElement> {
  $el: T
}

type ComponentRef<T extends HTMLElement = HTMLDivElement> = ComponentElRef<T> | null

type ElRef<T extends HTMLElement = HTMLDivElement> = Nullable<T>

interface ViteEnv {
  VITE_PORT: number
  VITE_API_URL: string
}

function parseInt(s: string | number, radix?: number): number

function parseFloat(string: string | number): number
