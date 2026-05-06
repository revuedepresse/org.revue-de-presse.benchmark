import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { Component, Input } from "@angular/core";

type Flow =
  | "login"
  | "signup"
  | "reset"
  | "edit-email"
  | "edit-password"
  | "confirm";
type AuthCardProps = {
  flow: Flow;
  formErrors?: ErrorMessage[];
  noticeKey?: {
    headline: string;
    body: string;
  };
  onSubmit?: (payload: {
    flow: Flow;
    values: Record<string, string | boolean>;
  }) => void;
};

import { t } from "../utils/i18n";
import type { ErrorMessage } from "../types";

@Component({
  selector: "auth-card",
  template: `
    <section class="rdp-auth-card">
      <ng-container *ngIf="flow === 'confirm' && !!noticeKey"
        ><notice
          [headlineKey]="noticeKey!.headline"
          [bodyKey]="noticeKey!.body"
        ></notice
      ></ng-container>
      <ng-container *ngIf="flow !== 'confirm'"
        ><div class="rdp-auth-card__panel">
          <h2 class="rdp-auth-card__title">{{t(\`auth.\${flow}.title\`)}}</h2>
          <ng-container *ngIf="flow === 'reset'"
            ><p>{{t('auth.reset.body')}}</p></ng-container
          >
          <ng-container
            *ngIf="flow === 'login' || flow === 'signup' || flow === 'reset' || flow === 'edit-email'"
            ><email-field
              name="email"
              [value]="email"
              (change)="email = $event"
            ></email-field
          ></ng-container>
          <ng-container *ngIf="flow === 'login'"
            ><password-field
              name="password"
              mode="login"
              [value]="password"
              (change)="password = $event"
            ></password-field>
            <checkbox
              name="rememberMe"
              labelKey="auth.remember-me"
              [checked]="rememberMe"
              (change)="rememberMe = $event"
            ></checkbox
          ></ng-container>
          <ng-container *ngIf="flow === 'signup'"
            ><password-field
              name="password"
              mode="new"
              [value]="password"
              (change)="password = $event"
            ></password-field>
            <checkbox
              name="tos"
              labelKey="auth.tos.checkbox-label"
              [checked]="tos"
              (change)="tos = $event"
            ></checkbox
          ></ng-container>
          <ng-container *ngIf="flow === 'edit-email'"
            ><password-field
              name="currentPassword"
              mode="login"
              labelKey="auth.edit-email.current-password-label"
              [value]="currentPassword"
              (change)="currentPassword = $event"
            ></password-field
          ></ng-container>
          <ng-container *ngIf="flow === 'edit-password'"
            ><password-field
              name="currentPassword"
              mode="login"
              labelKey="auth.edit-password.current-label"
              [value]="currentPassword"
              (change)="currentPassword = $event"
            ></password-field>
            <password-field
              name="newPassword"
              mode="new"
              labelKey="auth.edit-password.new-label"
              [value]="newPassword"
              (change)="newPassword = $event"
            ></password-field>
            <password-field
              name="confirmPassword"
              mode="new"
              labelKey="auth.edit-password.confirm-label"
              [value]="confirmPassword"
              (change)="confirmPassword = $event"
              [showHelper]="false"
            ></password-field
          ></ng-container>
          <button
            variant="form"
            [labelKey]="\`auth.\${flow}.submit-label\`"
            (click)="submit()"
          ></button>
          <ng-container *ngIf="!!formErrors && formErrors.length > 0"
            ><form-error [errors]="formErrors!"></form-error
          ></ng-container>
          <ng-container *ngIf="flow === 'login'"
            ><link href="#" labelKey="auth.login.forgot-password"
          /></ng-container></div
      ></ng-container>
      <style>
        {{\`
                .rdp-auth-card { display: grid; gap: var(--separation-2); }
                .rdp-auth-card__panel {
                  background: var(--color-white);
                  padding: var(--separation-3);
                  border-radius: var(--radius-default);
                  display: grid;
                  gap: var(--separation-1);
                  font-family: 'Roboto', sans-serif;
                }
                .rdp-auth-card__title {
                  margin: 0;
                  font-family: 'Signika', sans-serif;
                  color: var(--color-content-text);
                  text-align: center;
                }
              \`}}
      </style>
    </section>
  `,
  styles: [
    `
      :host {
        display: contents;
      }
    `,
  ],
})
export default class AuthCard {
  t = t;

  @Input() flow!: AuthCardProps["flow"];
  @Input() onSubmit!: AuthCardProps["onSubmit"];
  @Input() noticeKey!: AuthCardProps["noticeKey"];
  @Input() formErrors!: AuthCardProps["formErrors"];

  email = "";
  password = "";
  currentPassword = "";
  newPassword = "";
  confirmPassword = "";
  rememberMe = false;
  tos = false;
  submit() {
    const values: Record<string, string | boolean> = {};
    if (this.flow === "login") {
      values.email = this.email;
      values.password = this.password;
      values.rememberMe = this.rememberMe;
    } else if (this.flow === "signup") {
      values.email = this.email;
      values.password = this.password;
      values.tos = this.tos;
    } else if (this.flow === "reset") {
      values.email = this.email;
    } else if (this.flow === "edit-email") {
      values.email = this.email;
      values.currentPassword = this.currentPassword;
    } else if (this.flow === "edit-password") {
      values.currentPassword = this.currentPassword;
      values.newPassword = this.newPassword;
      values.confirmPassword = this.confirmPassword;
    }
    this.onSubmit?.({
      flow: this.flow,
      values,
    });
  }
}

@NgModule({
  declarations: [AuthCard],
  imports: [
    CommonModule,
    NoticeModule,
    EmailFieldModule,
    PasswordFieldModule,
    CheckboxModule,
    ButtonModule,
    FormErrorModule,
    LinkModule,
  ],
  exports: [AuthCard],
})
export class AuthCardModule {}
