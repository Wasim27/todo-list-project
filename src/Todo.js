export default class Todo {
  constructor() {
      this.projects = []
  }

  getProjects() {
    return this.projects;
  }

  addProject(newProject) {
    this.projects.push(newProject);
  }

  getProject(projectTitle) {
    return this.projects.find((project) => project.title === projectTitle)
  }
}