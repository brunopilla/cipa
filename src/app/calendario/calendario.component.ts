import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { OcorrenciaService } from '../services/ocorrencia.service';
import { PoModalComponent, PoTableColumn, PoTableColumnSpacing, PoTableComponent } from '@po-ui/ng-components';

interface Ocorrencia {
  dia: number;
  des_resum_acidtrab: string;
  tipo: number;
  idi_tip_ocor_acidtrab: number;
}

@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.component.html',
  styleUrls: ['./calendario.component.css']
})
export class CalendarioComponent implements OnInit {
    showTable: boolean = true;
  today: Date = new Date();
  items!: Ocorrencia[];
  itemsModal!: Ocorrencia[];
  currentMonth: boolean = false;
  selectedDate!: Date;
  selectedMonth: number = new Date().getMonth() + 1;
  selectedYear: number = new Date().getFullYear();
  selectedDay: number = new Date().getDay();
  cards: { class: string, top: number, left: number, content: string }[] = [];
  ocorrenciasDoMes: number[] = [];
  tableColumns: PoTableColumn[] = [
    { property: 'dia', label: 'Dia' },
    { property: 'des_resum_acidtrab', label: 'Resumo Ocorrência' },
    { property: 'tipo', label: 'Tipo' }
  ];
  tableColumnsModal: PoTableColumn[] = [
    { property: 'dat_acidtrab', label: 'Data', type: 'date', format: 'dd/MM/yyyy' },
    { property: 'hora', label: 'Hora' },
    { property: 'des_investig_acidtrab', label: 'Detalhes Ocorrência' },
    { property: 'tipo', label: 'Tipo' }
  ];

  @ViewChild('table', { static: true })
  table!: PoTableComponent;
  @ViewChild('modal', { static: true }) modal!: PoModalComponent;
  @ViewChild('printSection', { static: false }) printSection!: ElementRef;

  constructor(private ocorrenciaService: OcorrenciaService, private el: ElementRef) {}

  ngOnInit(): void {
    if (this.selectedMonth == new Date().getMonth() + 1 && this.selectedYear == new Date().getFullYear()) {
      this.currentMonth = true;
    }else{
      this.currentMonth = false;
    }
    this.getOcorrenciasDoMes(this.selectedMonth, this.selectedYear);
  }

  getOcorrenciasDoMes(month: number, year: number): void {
    this.ocorrenciaService.getOcorrenciasDoMes(month, year).subscribe(ocorrencias => {
      this.ocorrenciasDoMes = ocorrencias.map(ocorrencia => ocorrencia.dia);
      this.items = ocorrencias;
      this.showTable = false;
      this.fillCalendar(month, year);
    });
}

  getOcorrenciasDoDia(day: number): void {
    this.ocorrenciaService.getOcorrenciasDoDia(day, this.selectedMonth, this.selectedYear).subscribe(ocorrencias => {
      this.ocorrenciasDoMes = ocorrencias.map(ocorrencia => ocorrencia.dia);
      this.itemsModal = ocorrencias;
      this.modal.open();
    });
  }

  updatePrint(): void{
    this.updateCalendar();
    setTimeout(() => {
      this.imprimirPagina();;
    }, 500); 
    
  }

  imprimirPagina(): void {
    const printSection = this.el.nativeElement.querySelector('.print-section');
    printSection.classList.add('print-section');

    window.print();
  }

  
  fillCalendar(month: number, year: number): void {
    this.cards = [];
    const daysInMonth = new Date(year, month, 0).getDate();
    let day = 0;

    for (let i = 1; i <= 49; i++) {
      if ([1, 2, 6, 7, 8, 9, 13, 14, 36, 37, 41, 42, 43, 44, 48, 49].includes(i)) {
        this.cards.push({ class: 'empty-card', top: this.getTop(i), left: this.getLeft(i), content: '' });
      } else {
        day++;
        this.selectedDate = new Date(this.selectedYear, this.selectedMonth - 1, day);

        if (day > 0 && day <= daysInMonth) {
          if (this.selectedDate < this.today) {
            const ocorrencia = this.items.find(oc => oc.dia === day);
            if (ocorrencia) {
              let cardClass = '';
              if(ocorrencia.idi_tip_ocor_acidtrab === 1 || ocorrencia.idi_tip_ocor_acidtrab === 2 || ocorrencia.idi_tip_ocor_acidtrab === 3 || ocorrencia.idi_tip_ocor_acidtrab === 5) {
                cardClass = 'red-card';
                this.showTable = true;
              } else if (ocorrencia.idi_tip_ocor_acidtrab === 4 || ocorrencia.idi_tip_ocor_acidtrab === 6){
                cardClass = 'yellow-card';
                this.showTable = true;
              } else {  
                cardClass = 'regular-card';
              }
              this.cards.push({ class: `card ${cardClass}`, top: this.getTop(i), left: this.getLeft(i), content: day.toString() });
            } else {
              this.cards.push({ class: 'card regular-card', top: this.getTop(i), left: this.getLeft(i), content: day.toString() });
            }
          } else {
            this.cards.push({ class: 'card disabled-card', top: this.getTop(i), left: this.getLeft(i), content: day.toString() });
            this.currentMonth = true;
            this.showTable = true;
          }
        } else if (day > daysInMonth && this.currentMonth) {
          this.cards.push({ class: 'card empty-disabled-card', top: this.getTop(i), left: this.getLeft(i), content: '' });
          this.showTable = true;
        } else if (day > daysInMonth && !this.currentMonth) {
          this.cards.push({ class: 'card empty-green-card', top: this.getTop(i), left: this.getLeft(i), content: '' });
        }
      }
    }
  }

  updateCalendar(): void {
    if (this.selectedMonth == new Date().getMonth() + 1 && this.selectedYear == new Date().getFullYear()) {
      this.currentMonth = true;
    }else{
      this.currentMonth = false;
    }
    this.getOcorrenciasDoMes(this.selectedMonth, this.selectedYear);
  }

  getTop(i: number): number {
    const row = Math.ceil(i / 7);
    return (row - 1) * 40 + 15;
  }

  getLeft(i: number): number {
    const column = i % 7 === 0 ? 7 : i % 7;
    return (column - 1) * 40 + 15;
  }
}
