import { Routes } from '@angular/router';
import { HomePage } from './pages/home';
import { AboutPage } from './pages/about';
import { PersonalPage } from './pages/personal';
import { PostsPage } from './pages/posts';
import { ContactPage } from './pages/contact';

export const routes: Routes = [
	{ path: '', component: HomePage },
	{ path: 'about', component: AboutPage },
	{ path: 'personal', component: PersonalPage },
	{ path: 'posts', component: PostsPage },
	{ path: 'contact', component: ContactPage },
	{ path: '**', redirectTo: '' }
];
