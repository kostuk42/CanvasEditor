export default class Stack {
    constructor() {
        this.story = [];
        this.lineStory = [];
    }

    getStory() {
        this.story = JSON.parse(localStorage.getItem('story'))||[]
    }

    setStory(command) {
        this.getStory();
        this.story.push(command);
        localStorage.setItem('story', JSON.stringify(this.story));
    }
    saveLineStory() {
        this.setStory(this.lineStory)
    }
    
    removeStory() {
        this.clearLocalStory();
        localStorage.removeItem('story');
    }
    
    saveToLineStory(point) {
        this.lineStory.push(point);
    }

    clearLocalStory () {
        this.story = [];
        this.lineStory = [];
    }
    removeLastCommand() {
        this.getStory();
        this.story.pop();
        localStorage.setItem('story', JSON.stringify(this.story));
        
    }
    
}