import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
    name: 'turkishDate',
    standalone: true
})
export class TurkishDatePipe implements PipeTransform {
    transform(value: any, format: string = 'dd MMMM yyyy'): string {
        if (!value) return '';

        const datePipe = new DatePipe('en-US');
        const formattedDate = datePipe.transform(value, format);

        if (!formattedDate) return '';

        const turkishMonths = [
            'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
            'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
        ];

        const englishMonths = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];

        let turkishDate = formattedDate;
        englishMonths.forEach((month, index) => {
            turkishDate = turkishDate.replace(month, turkishMonths[index]);
        });

        return turkishDate;
    }
}