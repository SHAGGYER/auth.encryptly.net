interface IField {
  [key: string]: Array<[(val: string) => Promise<boolean> | boolean, string]>;
}

interface IErrors {
  [key: string]: string;
}

export class ValidationService {
  static async run(field: IField, obj: any) {
    let errors: IErrors = {};
    for (let [key, rules] of Object.entries(field)) {
      if (errors[key]) continue;
      for (let rule of rules) {
        const func = rule[0];
        const error = rule[1];
        const result = await Promise.resolve(func(obj[key]));
        if (result) {
          errors[key] = error;
          break;
        }
      }
    }

    return errors;
  }
}
