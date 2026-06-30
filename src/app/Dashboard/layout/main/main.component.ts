import { Component, OnInit, OnDestroy } from '@angular/core';
import HeaderComponent from "../header/header.component";
import SidebarComponent from "../sidebar/sidebar.component";
import { RouterOutlet } from '@angular/router';
import { LoaderComponent } from "../../../Shared/Components/loader/loader.component";
import { LoaderService } from "../../../Core/services/loader.service";
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-main',
  imports: [HeaderComponent, SidebarComponent, RouterOutlet, LoaderComponent, AsyncPipe],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export default class MainComponent implements OnInit, OnDestroy {
    public loading$: any;
    public sidebarOpen: boolean = true;
    private destroy$ = new Subject<void>();

    constructor(private loaderService: LoaderService) {}

    ngOnInit(): void {
        this.loaderService.reset();
        this.loading$ = this.loaderService.loading$;
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    toggleSidebar(): void {
        this.sidebarOpen = !this.sidebarOpen;
    }
}



