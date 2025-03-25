import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CreateAiConsultantComponent } from '../../components/create-ai-consultant/create-ai-consultant.component';
import { Profile } from '../../../dashboard/models/profile';
import { AuthService } from '../../../auth/services/auth.service';
import { EditAiConsultantComponent } from '../../components/edit-ai-consultant/edit-ai-consultant.component';
import { AgentsService } from '../../../dashboard/services/agents.service';

@Component({
  selector: 'app-agents',
  imports: [
    CommonModule,
    RouterModule,
    CreateAiConsultantComponent,
    EditAiConsultantComponent,
  ],
  templateUrl: './agents.component.html',
  styleUrl: './agents.component.scss',
})
export class AgentsComponent implements OnInit {
  constructor(private agentService: AgentsService) {}

  agents: any = [
    {
      id: 1,
      title: 'Customer Support Assistant',
      description:
        'Designed to resolve sensitive issues efficiently while ensuring a positive customer experience',
      creator: 'Sayed E.',
      comments: 1,
      isActive: false,
    },
    {
      id: 2,
      title: 'Sales Executive',
      description:
        'Focused on driving revenue growth through new client acquisition and relationship management',
      creator: 'Jordan T.',
      comments: 1,
      isActive: false,
    },
    {
      id: 3,
      title: 'Product Manager',
      description:
        'Oversees product development from conception to launch, aligning business goals with user needs',
      creator: 'Taylor M.',
      comments: 1,
      isActive: false,
    },
    {
      id: 4,

      title: 'Marketing Specialist',
      description:
        'Expert in digital marketing strategies and brand development to enhance market presence',
      creator: 'Alex R.',
      comments: 1,
      isActive: false,
    },
    {
      id: 5,
      title: 'UX Designer',
      description:
        'Creates user-centered designs that enhance usability and improve overall user satisfaction',
      creator: 'Casey L.',
      comments: 1,
      isActive: false,
    },
    {
      id: 6,
      title: 'UX Designer',
      description:
        'Creates user-centered designs that enhance usability and improve overall user satisfaction',
      creator: 'Casey L.',
      comments: 1,
      isActive: true,
    },
    {
      id: 7,
      title: 'UX Designer',
      description:
        'Creates user-centered designs that enhance usability and improve overall user satisfaction',
      creator: 'Casey L.',
      comments: 1,
      isActive: true,
    },
    {
      id: 8,
      title: 'UX Designer',
      description:
        'Creates user-centered designs that enhance usability and improve overall user satisfaction',
      creator: 'Casey L.',
      comments: 1,
      isActive: true,
    },
  ];

  displayEditDialog: boolean = false;
  displayEditConsultantDialog: boolean = false;
  selectedAgent: any = null;

  featuredAgents = this.agents.slice(0, 10);

  ngOnInit(): void {
    this.getAllAgents();
  }

  openDialog() {
    this.displayEditDialog = true;
  }

  getAllAgents() {
    this.agentService.getAllAgents(1, 100).subscribe({
      next: (res: any) => {
        console.log('agents', res.data);
        // this.agents = res.data;
      },
    });
  }

  onDisplayChange(value: boolean) {
    this.displayEditDialog = value;
  }

  onEditDisplayChange(value: boolean) {
    this.displayEditConsultantDialog = value;
  }

  openDropdownIndex: number | null = null;

  toggleDropdown(index: number, event: Event): void {
    event.stopPropagation();
    this.openDropdownIndex = this.openDropdownIndex === index ? null : index;
  }

  editAgent(agent: any): void {
    this.selectedAgent = agent;
    console.log(this.selectedAgent);

    this.displayEditConsultantDialog = true;
    this.openDropdownIndex = null;
  }

  toggleActivation(agent: any, event: Event): void {
    event.stopPropagation(); // Prevent dropdown from closing
    agent.isActive = !agent.isActive;
    console.log(agent.isActive ? 'Activated' : 'Deactivated', 'agent:', agent);
  }

  @HostListener('document:click')
  closeDropdown(): void {
    this.openDropdownIndex = null;
  }
}

// const scrollers = document.querySelectorAll('.scroller');

// // If a user hasn't opted in for recuded motion, then we add the animation
// if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
//   addAnimation();
// }

// function addAnimation() {
//   scrollers.forEach((scroller: any) => {
//     // add data-animated="true" to every `.scroller` on the page
//     scroller.setAttribute('data-animated', true);

//     // Make an array from the elements within `.scroller-inner`
//     const scrollerInner = scroller.querySelector('.scroller__inner');
//     const scrollerContent = Array.from(scrollerInner.children);

//     // For each item in the array, clone it
//     // add aria-hidden to it
//     // add it into the `.scroller-inner`
//     scrollerContent.forEach((item: any) => {
//       const duplicatedItem = item.cloneNode(true);
//       duplicatedItem.setAttribute('aria-hidden', true);
//       scrollerInner.appendChild(duplicatedItem);
//     });
//   });
// }
