import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CurrencyService } from '../../service/currency.service';

interface ExampleRate {
  currency: string;
  value: number;
  name: string;
}

@Component({
  selector: 'app-converter',
  templateUrl: './converter.page.html',
  styleUrls: ['./converter.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule
  ],
  providers: [DecimalPipe]
})
export class ConverterPage {
  fromCurrency = 'USD';
  toCurrency = 'BRL';
  amount = 1;
  result: number | null = null;
  conversionRate: number | null = null;
  currencies: string[] = [];
  error: string = '';
  isLoading: boolean = false;
  exampleRates: ExampleRate[] = [];
  isConverting: boolean = false;

  currencyNames: { [key: string]: string } = {
    'USD': 'Dólar Americano',
    'BRL': 'Real Brasileiro',
    'EUR': 'Euro',
    'GBP': 'Libra Esterlina',
    'JPY': 'Iene Japonês',
    'CAD': 'Dólar Canadense',
    'AUD': 'Dólar Australiano',
    'CHF': 'Franco Suíço',
    'CNY': 'Yuan Chinês',
    'INR': 'Rúpia Indiana',
    'MXN': 'Peso Mexicano',
    'RUB': 'Rublo Russo',
    'TRY': 'Lira Turca',
    'ZAR': 'Rand Sul-Africano'
  };

  constructor(private currencyService: CurrencyService) {
    this.loadCurrencies();
  }

  loadCurrencies() {
    // Aqui garante que vai exibir apenas as moedas acima, e nao todas da api, que poderia causar com que o limite de request seja atingido
    this.currencies = Object.keys(this.currencyNames).sort();
    this.loadExampleRates();
  }

  loadExampleRates() {
    this.isLoading = true;
    
    this.currencyService.getExchangeRates(this.fromCurrency)
      .subscribe({
        next: (rates) => {
          this.exampleRates = [];
          
          // Aqui pra garantir que nao será exibido a moeda que eu escolhi na exibição do cambio
          const exampleCurrencies = this.currencies
            .filter(c => c !== this.fromCurrency);
          
          exampleCurrencies.forEach(currency => {
            if (rates[currency]) {
              this.exampleRates.push({
                currency: currency,
                value: rates[currency],
                name: this.getCurrencyName(currency)
              });
            }
          });
          
          // Aqui ordena alfabeticamente as moedas de cambio
          this.exampleRates.sort((a, b) => a.currency.localeCompare(b.currency));
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Erro ao carregar taxas de exemplo:', err);
          this.isLoading = false;
          
          this.createFallbackRates();
        }
      });
  }

  // Aqui é pra quando nao for possivel contatar a api, ja tendo exemplos dos valores
  createFallbackRates() {
    this.exampleRates = [];
    const fallbackRates: {[key: string]: number} = {
      'BRL': 5.50, 'EUR': 0.93, 'GBP': 0.80, 'JPY': 147.50,
      'CAD': 1.35, 'AUD': 1.55, 'CHF': 0.88, 'CNY': 7.25,
      'INR': 83.20, 'MXN': 17.80, 'RUB': 95.70, 'TRY': 27.50, 'ZAR': 19.20
    };
    
    this.currencies
      .filter(c => c !== this.fromCurrency && fallbackRates[c])
      .forEach(currency => {
        this.exampleRates.push({
          currency: currency,
          value: fallbackRates[currency],
          name: this.getCurrencyName(currency)
        });
      });
    
    this.exampleRates.sort((a, b) => a.currency.localeCompare(b.currency));
  }

  convert() {
    if (!this.isFormValid()) return;

    this.isConverting = true;
    this.error = '';
    this.result = null;
    this.conversionRate = null;

    this.currencyService.convert(this.fromCurrency, this.toCurrency, this.amount)
      .subscribe({
        next: (value) => {
          this.result = value;
          this.conversionRate = value / this.amount;
          this.isConverting = false;
        },
        error: (err) => {
          console.error('Erro na conversão:', err);
          this.error = 'Erro ao converter. Verifique sua conexão e tente novamente.';
          this.isConverting = false;
        }
      });
  }
  // aqui vai só inverter a ordem quem ta sendo convertido
  swapCurrencies() {
    [this.fromCurrency, this.toCurrency] = [this.toCurrency, this.fromCurrency];
    this.exampleRates = [];
    this.loadExampleRates();
    
    if (this.result !== null) {
      this.convert();
    }
  }

  isFormValid(): boolean {
    return this.amount > 0 && 
           this.fromCurrency !== this.toCurrency && 
           !this.isConverting;
  }

  getCurrencyName(code: string): string {
    return this.currencyNames[code] || code;
  }
}