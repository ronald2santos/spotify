import {
  transition,
  trigger,
  query,
  style,
  animate,
  group,
} from '@angular/animations';

export const slideInAnimation = trigger('routeAnimations', [
    transition('Overview => *', [
        query(':enter, :leave', style({ position: 'fixed', width: '100%' }), { optional: true }),
        group([
            query(
                ':enter',
                [style({ transform: 'translateX(-100%)' }), animate('0.5s ease-in-out', style({ transform: 'translateX(0%)' }))],
                { optional: true }
            ),
            query(
                ':leave',
                [style({ transform: 'translateX(0%)' }), animate('0.5s ease-in-out', style({ transform: 'translateX(100%)' }))],
                { optional: true }
            ),
        ]),
    ]),
    transition('Profile => *', [
        query(':enter, :leave', style({ position: 'fixed', width: '100%' }), { optional: true }),
        group([
            query(
                ':enter',
                [style({ transform: 'translateX(100%)' }), animate('0.5s ease-in-out', style({ transform: 'translateX(0%)' }))],
                { optional: true }
            ),
            query(
                ':leave',
                [style({ transform: 'translateX(0%)' }), animate('0.5s ease-in-out', style({ transform: 'translateX(-100%)' }))],
                { optional: true }
            ),
        ]),
    ]),
]);

export const fadeInAnimation = trigger('fade', [transition('void => *', [style({ opacity: 0 }), animate(200, style({ opacity: 1 }))])]);
