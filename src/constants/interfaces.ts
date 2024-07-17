export enum EXTRA_TYPE {
  LINK = 'url',
  VERSION = 'version',
  EMAIL = 'email'
}

export interface EnvironmentExtra {
  label: string
  value?: string
  type?: EXTRA_TYPE
}

export interface Environment {
  id: string
  name: string
  type: string
  level: number
  description: string
  extra?: EnvironmentExtra[]
  parent?: string
  uses?: string[]
  contains?: string[]
}

export interface FormOption {
  name: string
  value: string
}
