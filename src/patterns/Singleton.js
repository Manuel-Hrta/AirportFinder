// Singleton.js
class SearchHistorySingleton {
    constructor() {
        if (!SearchHistorySingleton.instance) {
            this.MAX_RECENT_SEARCHES = 6;
            this.history = JSON.parse(localStorage.getItem('recentSearches')) || [];
            SearchHistorySingleton.instance = this;
        }
        return SearchHistorySingleton.instance;
    }

    addSearch(query) {
        if (!query.trim()) return;

        // Generar lista actualizada sin reasignar la propiedad `history`
        const updatedHistory = [query, ...this.history.filter(item => item !== query)]
                              .slice(0, this.MAX_RECENT_SEARCHES);

        this.history.splice(0, this.history.length, ...updatedHistory);

        // Guardar en localStorage
        localStorage.setItem('recentSearches', JSON.stringify(this.history));
    }

    getHistory() {
        return this.history;
    }
}

const searchHistoryInstance = new SearchHistorySingleton();
// Congelar el objeto para evitar mutaciones accidentales
Object.freeze(searchHistoryInstance);

export default searchHistoryInstance;
