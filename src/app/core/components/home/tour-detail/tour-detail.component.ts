import { Component } from '@angular/core';
import { CalendarOptions } from 'fullcalendar';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';

@Component({
  selector: 'app-tour-detail',
  templateUrl: './tour-detail.component.html',
})
export class TourDetailComponent {
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, interactionPlugin],
    dateClick: (arg) => this.handleDateClick(arg),
    eventClassNames: 'p-button bg-primary border-none shadow-2 p-ripple',
    events: [
      { title: 'event 1', date: '2024-11-02' },
      { title: 'event 2', date: '2024-11-03' }
    ]
  };

  handleDateClick(arg: DateClickArg): void {
    alert('Date clicked: ' + arg.dateStr);
  }
}
