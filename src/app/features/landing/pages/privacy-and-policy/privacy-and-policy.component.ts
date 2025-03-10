import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FooterComponent } from '../../../../shared/footer/footer.component';
import { NavbarComponent } from '../../../../shared/navbar/navbar.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-privacy-and-policy',
  imports: [CommonModule, FooterComponent, NavbarComponent, RouterModule],
  templateUrl: './privacy-and-policy.component.html',
  styleUrl: './privacy-and-policy.component.scss',
})
export class PrivacyAndPolicyComponent {
  title: string = 'Privacy Policy ';
  introText: string =
    'Your privacy is important to us at Untitled. We respect your privacy regarding any information we may collect from you across our website.';
  sections: { title: string; content: string[] }[] = [
    {
      title: 'What information do we collect?',
      content: [
        'Dolor enim eu tortor urna sed duis nulla. Aliquam vestibulum, nulla odio nisl vitae. In aliquet pellentesque aenean hac vestibulum turpis mi bibendum diam. Tempor integer aliquam in vitae malesuada fringilla.',
        'Elit nisi in eleifend sed nisi. Pulvinar at orci, proin imperdiet commodo consectetur convallis risus. Sed condimentum enim dignissim adipiscing faucibus consequat, urna. Viverra purus et erat auctor aliquam. Risus, volutpat vulputate posuere purus sit congue convallis aliquet. Arcu id augue ut feugiat donec porttitor neque. Mauris, neque ultricies eu vestibulum, bibendum quam lorem id. Dolor lacus, eget nunc lectus in tellus, pharetra, porttitor.',
        'Ipsum sit mattis nulla quam nulla. Gravida id gravida ac enim mauris id. Non pellentesque congue eget consectetur turpis. Sapien, dictum molestie sem tempor. Diam elit, orci, tincidunt aenean tempus. Quis velit eget ut tortor tellus. Sed vel, congue felis elit erat nam nibh orci.',
      ],
    },
    {
      title: 'How do we use your information?',
      content: [
        'Dolor enim eu tortor urna sed duis nulla. Aliquam vestibulum, nulla odio nisl vitae. In aliquet pellentesque aenean hac vestibulum turpis mi bibendum diam. Tempor integer aliquam in vitae malesuada fringilla.',
        'Elit nisi in eleifend sed nisi. Pulvinar at orci, proin imperdiet commodo consectetur convallis risus. Sed condimentum enim dignissim adipiscing faucibus consequat, urna. Viverra purus et erat auctor aliquam. Risus, volutpat vulputate posuere purus sit congue convallis aliquet. Arcu id augue ut feugiat donec porttitor neque. Mauris, neque ultricies eu vestibulum, bibendum quam lorem id. Dolor lacus, eget nunc lectus in tellus, pharetra, porttitor.',
        'Ipsum sit mattis nulla quam nulla. Gravida id gravida ac enim mauris id. Non pellentesque congue eget consectetur turpis. Sapien, dictum molestie sem tempor. Diam elit, orci, tincidunt aenean tempus. Quis velit eget ut tortor tellus. Sed vel, congue felis elit erat nam nibh orci.',
      ],
    },
    {
      title: 'How do we use cookies and other tracking technologies?',
      content: [
        'Pharetra morbi libero id aliquam elit massa integer tellus. Quis felis aliquam ullamcorper porttitor. Pulvinar ullamcorper sit dictumst ut eget a, elementum eu. Maecenas est morbi mattis id in ac pellentesque ac.',
      ],
    },
    {
      title: 'How long do we keep your information?',
      content: [
        'Pharetra morbi libero id aliquam elit massa integer tellus. Quis felis aliquam ullamcorper porttitor. Pulvinar ullamcorper sit dictumst ut eget a, elementum eu. Maecenas est morbi mattis id in ac pellentesque ac.',
      ],
    },
    {
      title: 'How do we keep your information safe?',
      content: [
        'Pharetra morbi libero id aliquam elit massa integer tellus. Quis felis aliquam ullamcorper porttitor. Pulvinar ullamcorper sit dictumst ut eget a, elementum eu. Maecenas est morbi mattis id in ac pellentesque ac.',
      ],
    },
    {
      title: 'What are your privacy rights?',
      content: [
        'Pharetra morbi libero id aliquam elit massa integer tellus. Quis felis aliquam ullamcorper porttitor. Pulvinar ullamcorper sit dictumst ut eget a, elementum eu. Maecenas est morbi mattis id in ac pellentesque ac.',
      ],
    },

    {
      title: 'How can you contact us about this policy?',
      content: [
        'Sagittis et eu at elementum, quis in. Proin praesent volutpat egestas sociis sit lorem nunc nunc sit. Eget diam curabitur mi ac. Auctor rutrum lacus malesuada massa ornare et. Vulputate consectetur ac ultrices at diam dui eget fringilla tincidunt. Arcu sit dignissim massa erat cursus vulputate gravida id. Sed quis auctor vulputate hac elementum gravida cursus dis.',
        '     1- Lectus id duis vitae porttitor enim gravida morbi.',
        ' 2- Eu turpis posuere semper feugiat volutpat elit, ultrices suspendisse. Auctor vel in vitae placerat.',
        ' 3- Suspendisse maecenas ac donec scelerisque diam sed est duis purus.',
      ],
    },
  ];
}
