
export abstract class Error {
  abstract describeWithContext(context:string):string
  describe():string {
    return this.describeWithContext('')
  }
}

export class BadPrimitive extends Error {
  constructor(public type:string, public value:any) {
    super()
  }
  describeWithContext(context:string):string {
    const where = context == ''
      ? ''
      : ` at ${context}`
    const value = stringify(this.value)
    return `Expecting ${this.type}${where} but instead got: '${value}'`
  }
}

export class BadIndex extends Error {
  constructor(public index:number, public nested:Error) {
    super()
  }
  describeWithContext(context:string):string {
    return this.nested.describeWithContext(`${context}[${this.index}]`)
  }
}

export class BadField extends Error {
  constructor(public field:string, public nested:Error) {
    super()
  }
  describeWithContext(context:string):string {
    return this.nested.describeWithContext(`${context}["${this.field}"]`)
  }
}

export class BadEither extends Error {
  constructor(public problems:Error[]) {
    super()
  }
  describeWithContext(context:string):string {
    const {problems} = this
    const descriptions = problems.map(problem => problem.describe()).join('\n')
    const where = context === ``
      ? ``
      : ` at ${context}`


    return `I ran into the following problems${where}:\n\n${descriptions}`
  }
}

export class Bad extends Error {
  constructor(public message:string) {
    super()
  }
  describeWithContext(context:string):string {
    const {message} = this
    const where = context === ``
      ? ``
      : ` at ${context}`

    return `Ran into a "fail" decoder${where}:${message}`
  }
}