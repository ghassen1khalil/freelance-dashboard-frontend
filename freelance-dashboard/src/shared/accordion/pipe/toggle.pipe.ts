import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name:'getToggleFunction'
})
export class TogglePipe implements PipeTransform{
  /**
   * Make the toggle function available to be called from
   * outside.
   * @param index - index of the accordion item
   */
  transform(i: number, toggleFn: Function){
    return () => toggleFn(i);
  }
}