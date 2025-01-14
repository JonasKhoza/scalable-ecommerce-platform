interface ResponseI {
  success: boolean;
  data?: any;
  metadata?: any;
  error?: {
    code: number;
    message: string;
    details?: any;
  };
}

class ResponseStructure {
  public success: boolean;
  public statusCode: number;
  public data?: any;
  public metadata?: any;

  public error?: {
    code: number;
    message: string;
  };

  constructor(
    s: boolean,
    c: number,
    d?: any,
    mt?: any,
    err?: {
      code: number;
      message: string;
      details?: any;
    }
  ) {
    (this.success = s),
      (this.statusCode = c),
      (this.data = d),
      (this.metadata = mt),
      (this.error = err);
  }
}

export { ResponseI, ResponseStructure };
