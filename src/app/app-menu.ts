import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Dashboard',
    icon: 'bar-chart-2',
    children: [
      {
        title: 'Registration Status',
        link: '/student/registration-summary',
      },
      {
        title: 'Content Summary',
        link: '/dashboard/content-summary',
      },
      {
        title: 'Subscription Dashbord',
        link: '/dashboard/subscription-dashbord',
      },
      {
        title: 'Progress',
        link: '/reference/progress',
      },
    ],
  },

  {
    title: 'Reference',
    icon: 'book-outline',
    children: [
      {
        title: 'Exam Category',
        link: '/reference/exam-category',
      },
      {
        title: 'Subject',
        link: '/reference/subject',
      },
      {
        title: 'Stream',
        link: '/reference/stream',
      },
      {
        title: 'School',
        link: '/reference/school',
      },
      {
        title: 'Security Question',
        link: '/reference/security-question',
      },
      {
        title:'Chapter',
        link:'/reference/chapters'
      },
      {
        title:'System User',
        link:'/reference/system-user'
      },
      {
        title: 'Subscription Package',
        link: '/payment/subscription-package',
      }
      
    ],
  },
  {
    title: 'Statistics',
    icon: 'grid-outline',
    children: [
      {
        title: 'Personal Details',
        link: '/statistics/personal-details',
      },
      {
        title: 'Educational Details',
        link: '/statistics/educational-details',
      },
      {
        title: 'Package Histoty',
        link: '/statistics/package-histoty',
      },
    ],
  },
  {
    title: 'Student',
    icon: 'person-outline',
    children: [
      {
        title: 'Device Reset',
        link: '/student/device-reset',
      },
      // {
      //   title: 'Registration Summary',
      //   link: '/student/registration-summary',
      // },
    ],
  },
  {
    title: 'Payment',
    icon: 'credit-card-outline',
    children: [
      // {
      //   title: 'Subscription Package',
      //   link: '/payment/subscription-package',
      // },
      {
        title: 'Package Activation',
        link: '/payment/package-activation',
      },
      {
        title: 'Promos',
        link: '/payment/promos',
      },
    ],
  },
  {
    title: 'Notifications',
    icon: 'credit-card-outline',
    children: [
      {
        title: 'Push Notifications',
        link: '/notifications/push-notifications',
      },
      {
        title: 'SMS Notifications',
        link: '/notifications/sms-notifications',
      },
    ],
  },
  {
    title: 'Converter',
    icon: 'book-outline',
    children: [
      {
        title: 'Paper',
        link: '/converter/paper',
      },
      {
        title: 'OCR View',
        link: '/converter/ocr-view',
      },
    ],
  },
  {
    title: 'Content Uploads',
    icon: 'book-outline',
    children: [
      {
        title: 'Short Notes',
        link: '/content-uploads/short-notes',
      },
      // {
      //   title: 'OCR View',
      //   link: '/converter/ocr-view',
      // },
    ],
  },
  // {
  //   title: 'E-commerce',
  //   icon: 'shopping-cart-outline',
  //   link: '/pages/dashboard',
  //   home: true,
  // },
  // {
  //   title: 'IoT Dashboard',
  //   icon: 'home-outline',
  //   link: '/pages/iot-dashboard',
  // },
  // {
  //   title: 'FEATURES',
  //   group: true,
  // },
  // {
  //   title: 'Layout',
  //   icon: 'layout-outline',
  //   children: [
  //     {
  //       title: 'Stepper',
  //       link: '/pages/layout/stepper',
  //     },
  //     {
  //       title: 'List',
  //       link: '/pages/layout/list',
  //     },
  //     {
  //       title: 'Infinite List',
  //       link: '/pages/layout/infinite-list',
  //     },
  //     {
  //       title: 'Accordion',
  //       link: '/pages/layout/accordion',
  //     },
  //     {
  //       title: 'Tabs',
  //       pathMatch: 'prefix',
  //       link: '/pages/layout/tabs',
  //     },
  //   ],
  // },
  // {
  //   title: 'Forms',
  //   icon: 'edit-2-outline',
  //   children: [
  //     {
  //       title: 'Form Inputs',
  //       link: '/pages/forms/inputs',
  //     },
  //     {
  //       title: 'Form Layouts',
  //       link: '/pages/forms/layouts',
  //     },
  //     {
  //       title: 'Buttons',
  //       link: '/pages/forms/buttons',
  //     },
  //     {
  //       title: 'Datepicker',
  //       link: '/pages/forms/datepicker',
  //     },
  //   ],
  // },
  // {
  //   title: 'UI Features',
  //   icon: 'keypad-outline',
  //   link: '/pages/ui-features',
  //   children: [
  //     {
  //       title: 'Grid',
  //       link: '/pages/ui-features/grid',
  //     },
      // {
      //   title: 'Icons',
      //   link: '/pages/ui-features/icons',
      // },
  //     {
  //       title: 'Typography',
  //       link: '/pages/ui-features/typography',
  //     },
  //     {
  //       title: 'Animated Searches',
  //       link: '/pages/ui-features/search-fields',
  //     },
  //   ],
  // },
  // {
  //   title: 'Modal & Overlays',
  //   icon: 'browser-outline',
  //   children: [
  //     {
  //       title: 'Dialog',
  //       link: '/pages/modal-overlays/dialog',
  //     },
  //     {
  //       title: 'Window',
  //       link: '/pages/modal-overlays/window',
  //     },
  //     {
  //       title: 'Popover',
  //       link: '/pages/modal-overlays/popover',
  //     },
  //     {
  //       title: 'Toastr',
  //       link: '/pages/modal-overlays/toastr',
  //     },
  //     {
  //       title: 'Tooltip',
  //       link: '/pages/modal-overlays/tooltip',
  //     },
  //   ],
  // },
  // {
  //   title: 'Extra Components',
  //   icon: 'message-circle-outline',
  //   children: [
  //     {
  //       title: 'Calendar',
  //       link: '/pages/extra-components/calendar',
  //     },
  //     {
  //       title: 'Progress Bar',
  //       link: '/pages/extra-components/progress-bar',
  //     },
  //     {
  //       title: 'Spinner',
  //       link: '/pages/extra-components/spinner',
  //     },
  //     {
  //       title: 'Alert',
  //       link: '/pages/extra-components/alert',
  //     },
  //     {
  //       title: 'Calendar Kit',
  //       link: '/pages/extra-components/calendar-kit',
  //     },
  //     {
  //       title: 'Chat',
  //       link: '/pages/extra-components/chat',
  //     },
  //   ],
  // },
  // {
  //   title: 'Maps',
  //   icon: 'map-outline',
  //   children: [
  //     {
  //       title: 'Google Maps',
  //       link: '/pages/maps/gmaps',
  //     },
  //     {
  //       title: 'Leaflet Maps',
  //       link: '/pages/maps/leaflet',
  //     },
  //     {
  //       title: 'Bubble Maps',
  //       link: '/pages/maps/bubble',
  //     },
  //     {
  //       title: 'Search Maps',
  //       link: '/pages/maps/searchmap',
  //     },
  //   ],
  // },
  // {
  //   title: 'Charts',
  //   icon: 'pie-chart-outline',
  //   children: [
  //     {
  //       title: 'Echarts',
  //       link: '/pages/charts/echarts',
  //     },
  //     {
  //       title: 'Charts.js',
  //       link: '/pages/charts/chartjs',
  //     },
  //     {
  //       title: 'D3',
  //       link: '/pages/charts/d3',
  //     },
  //   ],
  // },
  // {
  //   title: 'Editors',
  //   icon: 'text-outline',
  //   children: [
  //     {
  //       title: 'TinyMCE',
  //       link: '/pages/editors/tinymce',
  //     },
  //     {
  //       title: 'CKEditor',
  //       link: '/pages/editors/ckeditor',
  //     },
  //   ],
  // },
  // {
  //   title: 'Tables & Data',
  //   icon: 'grid-outline',
  //   children: [
  //     {
  //       title: 'Smart Table',
  //       link: '/pages/tables/smart-table',
  //     },
  //     {
  //       title: 'Tree Grid',
  //       link: '/pages/tables/tree-grid',
  //     },
  //   ],
  // },
  // {
  //   title: 'Miscellaneous',
  //   icon: 'shuffle-2-outline',
  //   children: [
  //     {
  //       title: '404',
  //       link: '/pages/miscellaneous/404',
  //     },
  //   ],
  // },
  // {
  //   title: 'Auth',
  //   icon: 'lock-outline',
  //   children: [
  //     {
  //       title: 'Login',
  //       link: '/auth/login',
  //     },
  //     {
  //       title: 'Register',
  //       link: '/auth/register',
  //     },
  //     {
  //       title: 'Request Password',
  //       link: '/auth/request-password',
  //     },
  //     {
  //       title: 'Reset Password',
  //       link: '/auth/reset-password',
  //     },
    // ],
  // },
];
