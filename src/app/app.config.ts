import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

// Importamos Lucide y los iconos que usas en tu HTML
import { LucideAngularModule, Shield, LayoutDashboard, BellRing, Box, Users, GitMerge, Plus, ZapOff, Check, TriangleAlert } from 'lucide-angular';

export const appConfig: ApplicationConfig = {
  
  providers: [
    provideRouter(routes),
    importProvidersFrom(
      LucideAngularModule.pick({ 
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