import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class CurrencyService {
  private apiKey = 'aecd5cb8847ac985a93792c9'; 
  private baseUrl = `https://v6.exchangerate-api.com/v6/${this.apiKey}`;

  constructor(private http: HttpClient) {}

  convert(from: string, to: string, amount: number): Observable<number> {
    return this.http.get<any>(`${this.baseUrl}/pair/${from}/${to}`).pipe(
      map(data => {
        if (data.result === "success") {
          return amount * data.conversion_rate;
        }
        throw new Error('Erro na conversão');
      })
    );
  }

  getExchangeRates(base: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/latest/${base}`).pipe(
      map(data => {
        if (data.result === "success") {
          return data.conversion_rates;
        }
        throw new Error('Erro ao obter taxas de câmbio');
      })
    );
  }

  getCurrencies(): Observable<string[]> {
    return this.http.get<any>(`${this.baseUrl}/latest/USD`).pipe(
      map(data => {
        if (data.result === "success") {
          return Object.keys(data.conversion_rates);
        }
        throw new Error('Erro ao obter moedas');
      })
    );
  }
}