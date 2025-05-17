from serpapi import GoogleSearch

def fetch_results(query):
    params = {
        "engine": "google",
        "q": query,
        "api_key": "b65c1d77a716733c37cce04f4ee74bfe07c116d76ebe2c57b0b2c444f4d926a0",
        "num": 10
    }

    search = GoogleSearch(params)
    results = search.get_dict()

    output = []
    for result in results.get("organic_results", []):
        title = result.get("title")
        link = result.get("link")
        if title and link:
            output.append({"title": title, "link": link})

    return output

'''if __name__ == "__main__":
    user_query = input("Enter what you want to search for: ")
    result_string = fetch_results(user_query)
    print("\n--- Search Results ---\n")
    print(result_string)'''
