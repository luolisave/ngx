import { Routes } from '@angular/router';
import { HomePage } from './pages/home';
import { AboutPage } from './pages/about';
import { PostsPage } from './pages/posts';

export const routes: Routes = [
	{ path: '', component: HomePage },
	{ path: 'about', component: AboutPage },
	{ path: 'posts', component: PostsPage },
	{ path: '**', redirectTo: '' }
];
