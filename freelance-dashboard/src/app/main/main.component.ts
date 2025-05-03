import {Component, OnDestroy, OnInit} from '@angular/core';
import {Position, PositionState, StatusLabelEnum} from '../../../generated';
import {select, Store} from '@ngrx/store';
import {Subject, takeUntil} from 'rxjs';
import * as positionReducer from '../../core/store/reducers/position.reducer'
import * as filterReducer from '../../core/store/reducers/filter.reducer'
import {Router} from '@angular/router';
import {SetFilteredPositions} from '../../core/store/actions/filter.actions';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnDestroy {

  public positionsMap: {[key: string]: Array<Position>};
  public positionsYears: string[] = [];
  public statusDoughnutChartData: any | undefined;
  public statusCounts: { [key: string]: number } | undefined;

  // New properties for the freelancer acceptance chart
  public freelancerAcceptanceChartData: any | undefined;
  public freelancerAcceptanceCounts: { accepted: number, rejected: number } | undefined;
  public freelancerAcceptanceChartOptions: any;

  // Define the order of status cards
  public statusOrder = [
    StatusLabelEnum.CommercialSuggestion,
    StatusLabelEnum.Positioned,
    StatusLabelEnum.InterviewPlanned,
    StatusLabelEnum.WaitingForResponse,
    StatusLabelEnum.ResponseReceived
  ];
  public chartOptions: any = {
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          font: {
            size: 12
          },
          color: 'rgb(51, 51, 51)' // Dark text for light mode
        }
      },
      title: {
        display: true,
        text: this.translateService.instant('positionsByStatus'),
        font: {
          size: 16
        },
        color: 'rgb(51, 51, 51)' // Dark text for light mode
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.chart.data.datasets[0].data.reduce((a: number, b: number) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    },
    cutout: '60%',
    responsive: true,
    maintainAspectRatio: false
  };

  // Update chart options for dark mode
  private updateChartOptionsForDarkMode(isDarkMode: boolean): void {
    const textColor = isDarkMode ? 'rgb(229, 231, 235)' : 'rgb(51, 51, 51)';

    this.chartOptions = {
      ...this.chartOptions,
      plugins: {
        ...this.chartOptions.plugins,
        legend: {
          ...this.chartOptions.plugins.legend,
          labels: {
            ...this.chartOptions.plugins.legend.labels,
            color: textColor
          }
        },
        title: {
          ...this.chartOptions.plugins.title,
          color: textColor
        }
      }
    };

    if (this.freelancerAcceptanceChartOptions) {
      this.freelancerAcceptanceChartOptions = {
        ...this.freelancerAcceptanceChartOptions,
        plugins: {
          ...this.freelancerAcceptanceChartOptions.plugins,
          legend: {
            ...this.freelancerAcceptanceChartOptions.plugins.legend,
            labels: {
              ...this.freelancerAcceptanceChartOptions.plugins.legend.labels,
              color: textColor
            }
          },
          title: {
            ...this.freelancerAcceptanceChartOptions.plugins.title,
            color: textColor
          }
        }
      };
    }
  }

  private initializeFreelancerAcceptanceChartOptions(): void {
    this.freelancerAcceptanceChartOptions = {
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            usePointStyle: true,
            font: {
              size: 12
            },
            color: 'rgb(51, 51, 51)' // Dark text for light mode
          }
        },
        title: {
          display: true,
          text: this.translateService.instant('freelancerAcceptance'),
          font: {
            size: 16
          },
          color: 'rgb(51, 51, 51)' // Dark text for light mode
        },
        tooltip: {
          callbacks: {
            label: function(context: any) {
              const label = context.label || '';
              const value = context.raw || 0;
              const total = context.chart.data.datasets[0].data.reduce((a: number, b: number) => a + b, 0);
              const percentage = Math.round((value / total) * 100);
              return `${label}: ${value} (${percentage}%)`;
            }
          }
        }
      },
      cutout: '60%',
      responsive: true,
      maintainAspectRatio: false
    };
  }

  public isFilterSet: boolean | undefined;
  public isNoPositionsYet: boolean | undefined;
  public isNoResultForFilter: boolean | undefined;

  private totalPositionings: number = 0;
  private unsubscribe$ = new Subject<void>();

  constructor(private router: Router,
              private store: Store,
              private translateService: TranslateService) {
  }

  ngOnInit(): void {
    // Check for dark mode on initialization
    this.checkDarkMode();

    // Initialize freelancer acceptance chart options
    this.initializeFreelancerAcceptanceChartOptions();

    // Listen for language changes to update chart labels
    this.translateService.onLangChange
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        if (this.statusCounts) {
          this.updateStatusDoughnutChartData();
        }
        if (this.freelancerAcceptanceCounts) {
          this.updateFreelancerAcceptanceChartData();
        }
      });

    this.store.pipe(
      select(positionReducer.getPositions),
      takeUntil(this.unsubscribe$)
    ).subscribe((positions) => {
      if (positions !== undefined) {
        this.calculateStatusCounts(positions[PositionState.Active]);
        this.totalPositionings = this.calculateTotalPositionings(positions[PositionState.Active]);
      }
    });

    this.store.pipe(
      select(filterReducer.getFilter),
      takeUntil(this.unsubscribe$)
    ).subscribe(filter => {
      if (filter !== undefined && filter.length > 0) {
        this.isFilterSet = true;
      } else {
        this.isFilterSet = undefined;
      }
    });
  }

  private calculateStatusCounts(positions: { [stateKey: string]: Array<Position> }): void {
    const counts: { [key: string]: number } = {};
    const freelancerAcceptanceCounts = { accepted: 0, rejected: 0 };

    // Initialize counts for all statuses in StatusLabelEnum
    Object.values(StatusLabelEnum).forEach(status => {
      counts[status] = 0;
    });

    // Calculate counts based on the last status in Position.statuses[]
    Object.values(positions).forEach(positionList => {
      positionList.forEach(position => {
        const lastStatus = position.statuses?.[position.statuses.length - 1];
        if (lastStatus?.label) {
          counts[lastStatus.label] = (counts[lastStatus.label] || 0) + 1;

          // Calculate freelancer acceptance counts for positions with ResponseReceived status
          if (lastStatus.label === StatusLabelEnum.ResponseReceived) {
            if (position.isFreelancerAccepted === true) {
              freelancerAcceptanceCounts.accepted++;
            } else if (position.isFreelancerAccepted === false) {
              freelancerAcceptanceCounts.rejected++;
            }
          }
        }
      });
    });

    this.statusCounts = counts;
    this.freelancerAcceptanceCounts = freelancerAcceptanceCounts;

    this.updateStatusDoughnutChartData();
    this.updateFreelancerAcceptanceChartData();
  }

  private updateStatusDoughnutChartData(): void {
    if (this.statusCounts) {
      // Get status keys in the specified order
      const statusKeys = this.statusOrder.filter(status => status in this.statusCounts!);

      // Get data, background colors, and hover background colors in the same order
      const data = statusKeys.map(key => this.statusCounts![key]);
      const backgroundColors = statusKeys.map(key => this.getStatusBackgroundColor(key));
      const hoverBackgroundColors = statusKeys.map(key => this.getStatusHoverBackgroundColor(key));

      // Translate the status labels
      const translatedLabels = statusKeys.map(key => {
        return this.translateService.instant(key);
      });

      this.statusDoughnutChartData = {
        labels: translatedLabels,
        datasets: [
          {
            data: data,
            backgroundColor: backgroundColors,
            hoverBackgroundColor: hoverBackgroundColors
          }
        ]
      };

      // Update the chart title with translation
      this.chartOptions = {
        ...this.chartOptions,
        plugins: {
          ...this.chartOptions.plugins,
          title: {
            ...this.chartOptions.plugins.title,
            text: this.translateService.instant('positionsByStatus')
          }
        }
      };
    }
  }

  private updateFreelancerAcceptanceChartData(): void {
    if (this.freelancerAcceptanceCounts) {
      // Define labels and data
      const labels = [
        this.translateService.instant('accepted'),
        this.translateService.instant('rejected')
      ];

      const data = [
        this.freelancerAcceptanceCounts.accepted,
        this.freelancerAcceptanceCounts.rejected
      ];

      // Define colors
      const backgroundColors = ['#4BC0C0', '#FF6384']; // Green for accepted, Red for rejected
      const hoverBackgroundColors = ['#4BC0C0D9', '#FF6384D9'];

      this.freelancerAcceptanceChartData = {
        labels: labels,
        datasets: [
          {
            data: data,
            backgroundColor: backgroundColors,
            hoverBackgroundColor: hoverBackgroundColors
          }
        ]
      };

      // Update the chart title with translation
      this.freelancerAcceptanceChartOptions = {
        ...this.freelancerAcceptanceChartOptions,
        plugins: {
          ...this.freelancerAcceptanceChartOptions.plugins,
          title: {
            ...this.freelancerAcceptanceChartOptions.plugins.title,
            text: this.translateService.instant('freelancerAcceptance')
          }
        }
      };
    }
  }

  private getStatusBackgroundColor(status: string): string {
    switch (status) {
      case StatusLabelEnum.CommercialSuggestion:
        return '#36A2EB';
      case StatusLabelEnum.Positioned:
        return '#4BC0C0';
      case StatusLabelEnum.InterviewPlanned:
        return '#9966FF';
      case StatusLabelEnum.WaitingForResponse:
        return '#FFCE56';
      case StatusLabelEnum.ResponseReceived:
        return '#FF6384';
      default:
        return '#C9CBCF';
    }
  }

  private getStatusHoverBackgroundColor(status: string): string {
    switch (status) {
      case StatusLabelEnum.CommercialSuggestion:
        return '#36A2EBD9';
      case StatusLabelEnum.Positioned:
        return '#4BC0C0D9';
      case StatusLabelEnum.InterviewPlanned:
        return '#9966FFD9';
      case StatusLabelEnum.WaitingForResponse:
        return '#FFCE56D9';
      case StatusLabelEnum.ResponseReceived:
        return '#FF6384D9';
      default:
        return '#C9CBCFD9';
    }
  }

  private calculateTotalPositionings(positions: { [stateKey: string]: Array<Position> }): number {
    return Object.values(positions).reduce((total, positionList) => total + positionList.length, 0);
  }

  public calculatePercentage(count: number): number {
    return this.totalPositionings > 0 ? Math.round((count / this.totalPositionings) * 100) : 0;
  }

  public goToAddPosition() {
    this.router.navigate(['/', 'position']);
  }

  public getStatusIcon(status: string): string {
    switch (status) {
      case StatusLabelEnum.CommercialSuggestion:
        return 'pi pi-briefcase';
      case StatusLabelEnum.Positioned:
        return 'pi pi-check-circle';
      case StatusLabelEnum.InterviewPlanned:
        return 'pi pi-calendar';
      case StatusLabelEnum.WaitingForResponse:
        return 'pi pi-clock';
      case StatusLabelEnum.ResponseReceived:
        return 'pi pi-envelope';
      default:
        return 'pi pi-tag';
    }
  }

  public getStatusIconClass(status: string): string {
    switch (status) {
      case StatusLabelEnum.CommercialSuggestion:
        return 'bg-blue-100 dark:bg-blue-900';
      case StatusLabelEnum.Positioned:
        return 'bg-green-100 dark:bg-green-900';
      case StatusLabelEnum.InterviewPlanned:
        return 'bg-purple-100 dark:bg-purple-900';
      case StatusLabelEnum.WaitingForResponse:
        return 'bg-yellow-100 dark:bg-yellow-900';
      case StatusLabelEnum.ResponseReceived:
        return 'bg-red-100 dark:bg-red-900';
      default:
        return 'bg-gray-100 dark:bg-gray-900';
    }
  }

  public getStatusColorClass(status: string): string {
    switch (status) {
      case StatusLabelEnum.CommercialSuggestion:
        return 'bg-blue-500';
      case StatusLabelEnum.Positioned:
        return 'bg-green-500';
      case StatusLabelEnum.InterviewPlanned:
        return 'bg-purple-500';
      case StatusLabelEnum.WaitingForResponse:
        return 'bg-yellow-500';
      case StatusLabelEnum.ResponseReceived:
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  }

  private checkDarkMode(): void {
    // Check if the document body or html has a dark mode class
    const isDarkMode = document.body.classList.contains('dark-mode') ||
                       document.documentElement.classList.contains('dark-mode') ||
                       document.body.classList.contains('dark-theme') ||
                       document.documentElement.classList.contains('dark-theme');

    // Update chart options based on dark mode
    this.updateChartOptionsForDarkMode(isDarkMode);

    // Listen for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          const newIsDarkMode = document.body.classList.contains('dark-mode') ||
                               document.documentElement.classList.contains('dark-mode') ||
                               document.body.classList.contains('dark-theme') ||
                               document.documentElement.classList.contains('dark-theme');
          this.updateChartOptionsForDarkMode(newIsDarkMode);
        }
      });
    });

    // Observe both body and html for class changes
    observer.observe(document.body, { attributes: true });
    observer.observe(document.documentElement, { attributes: true });
  }

  ngOnDestroy(): void {
    this.store.dispatch(SetFilteredPositions({positions: undefined}))
    this.unsubscribe$.complete();
  }

  // Custom comparator function for keyvalue pipe to sort status cards
  public compareStatus = (a: { key: string, value: number }, b: { key: string, value: number }): number => {
    const indexA = this.statusOrder.indexOf(a.key as StatusLabelEnum);
    const indexB = this.statusOrder.indexOf(b.key as StatusLabelEnum);

    // If both keys are in the statusOrder array, sort by their position in the array
    if (indexA !== -1 && indexB !== -1) {
      return indexA - indexB;
    }

    // If only one key is in the statusOrder array, prioritize it
    if (indexA !== -1) {
      return -1;
    }
    if (indexB !== -1) {
      return 1;
    }

    // If neither key is in the statusOrder array, maintain original order
    return 0;
  }
}
