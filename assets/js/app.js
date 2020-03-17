
var app = new Vue({
  el: "#app",
  data: {
    message: "",
    currentPage: 1,
    pageSize: 10,
    searchKey: "",
    selectedTag: "",
    bookmarksJson: { metadata: {}, data: [] }
  },
  created() {
    var self = this;
    $.getJSON("data/bookmarks.json", data => {
      Object.assign(self.bookmarksJson, {
          metadata: data.metadata,
          data: data.data.sort((a, b) => (toDate(a.created_date) > toDate(b.created_date)) ? -1 : 1)
      });
      //console.log(self.bookmarksJson);
    });
  },
  methods: {
    showHome: function() {
      this.currentPage = 1;
      this.selectedTag = "";
      this.searchKey = "";
      this.message = "";
    },
    search: function() {
      this.currentPage = 1;
      this.selectedTag = "";
      this.searchKey = $("#searchKey").val();
      if (this.searchKey !== "") {
        this.message = "Search results for " + this.searchKey;
      } else {
        this.message = "";
      }
    },
    showByTag: function(tag) {
      //alert("showByTag: " + tag);
      this.searchKey = "";
      this.currentPage = 1;
      $("#searchKey").val("");
      this.selectedTag = tag;
      this.message = "Bookmarks with tag " + this.selectedTag;
    },
    setPageNumber : function (page) {
      console.log('set page number: '+page);
      this.currentPage = page || 1;
    }
  },
  computed: {
    allTags: function() {
      var tags = this.bookmarksJson.data.map(b => b.tags).flat();
      return tags.filter(function(item, pos) {
        return tags.indexOf(item) === pos;
      }).sort((a, b) => a > b ? 1 : -1);
    },
    visibleBookmarks: function() {
      var bookmarksResult = [];
      if (this.searchKey !== "") {
        bookmarksResult = this.bookmarksJson.data.filter(b =>
          b.title.toLowerCase().includes(this.searchKey.toLowerCase())
        );
      } else if (this.selectedTag !== "") {
        bookmarksResult = this.bookmarksJson.data.filter(b =>
          b.tags.includes(this.selectedTag)
        );
      } else {
        bookmarksResult = this.bookmarksJson.data;
      }
      return paginate(bookmarksResult, this.currentPage, this.pageSize);
    }
  }
});
