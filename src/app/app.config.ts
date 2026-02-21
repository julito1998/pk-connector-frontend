import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

// Importamos Lucide y los iconos que usas en tu HTML
import { LucideAngularModule, Search,Bell,Settings,Layers, Shield, LayoutDashboard, BellRing, Box, Users, GitMerge, Plus, ZapOff, Check, TriangleAlert } from 'lucide-angular';

export const appConfig: ApplicationConfig = {
  
  providers: [
    provideRouter(routes),
    importProvidersFrom(
      LucideAngularModule.pick({ 
        Search,Bell,Settings,
        Layers,
        Shield, 
        LayoutDashboard, 
        BellRing, 
        Box, 
        Users, 
        GitMerge, 
        Plus, 
        ZapOff, 
        Check,
        TriangleAlert
      })
    )
  ]
};