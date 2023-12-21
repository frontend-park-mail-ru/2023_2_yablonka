export default class HistoryItem extends Component {
    /**
     * Рендерит компонент в DOM
     */
    render() {
        return template({
            avatar: this.config.avatar_url,
            email: this.config.email,
            message: this.config.message,
            datetime: this.config.datetime
        });
    }
}