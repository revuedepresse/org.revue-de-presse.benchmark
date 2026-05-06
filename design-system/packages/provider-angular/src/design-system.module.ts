import { NgModule } from '@angular/core';
import { DesignSystemService } from './design-system.service';
export { DesignSystemService };

@NgModule({ providers: [DesignSystemService] })
export class DesignSystemModule {}
