import React, { useState, useEffect } from 'react';
import './Search.css';
import { useNavigate } from 'react-router-dom';
import SearchResultPostList from './SearchResultPostList';

const Search = ({username}) => {
  const [searchType, setSearchType] = useState('content');
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearchOptions, setShowSearchOptions] = useState(false);

  const navigate = useNavigate();

  function handleSearchTypeChange(type) {
    if(type === 'user')
    {
        // Alert the user for the key words that they can search for
        alert("keywords: mostPopularUser, minPopularUser, mostCBUser, minCBUser, User:");
    }
    setSearchType(type);
  }

  async function handleSearch() {
    if(searchType === 'content')
    {
        // an API call to search content
        const response = await fetch(`http://localhost:8080/searchContent?searchTerm=${searchTerm}`);

        const data = await response.json();
        if(data.length === 0)
        {
            // it means we don't have any related content in the database so just alert the user 
            alert("No content found!");
            setSearchTerm("");
        }
        else
        {
            // Show the result posts list
            // but it was giving errors when passing list in the URL so I decided to pass the search term and do the fetch call on the results page 
            // itself and we are guranteed to have results in this approach
            navigate(`/showResultPostList/${searchTerm}/${username}`);
            setSearchTerm("");
        }
    }
    else
    {
        // Searching Users
        // In users currently we can only search for the keywords that we gave because I don't know how to do it without keywords at the moment
        if(searchTerm.includes("mostPopularUser"))
        {
            
            const response = await fetch(`http://localhost:8080/mostLikedUser`);

            const data = await response.json();
            
            navigate(`/showSearchResultUser/mostPopularUser/${username}/${data}`)
            setSearchTerm("");
        }
        else if(searchTerm.includes("minPopularUser"))
        {
            // minPopularUser is someone who has maximum number of dislikes on his posts

            const response = await fetch(`http://localhost:8080/mostDislikedUser`);

            const data = await response.json();
            
            navigate(`/showSearchResultUser/minPopularUser/${username}/${data}`)
            setSearchTerm("");
        }
        else if(searchTerm.includes("mostCBUser"))
        {
            // search for most contributing user or the user with most posts 
            // Every user has 0 contribution points assigned to them when they create an account and then it keeps increasing as user posts
            // every post gives you 10 points while adding comments on posts give you 5 contributing points
            // and I will classify or give every user a badge according to this points -- useful extra feature
            const response = await fetch(`http://localhost:8080/mostContributingUser`);

            const data = await response.json();
            
            navigate(`/showSearchResultUser/mostContributingUser/${username}/${data}`)
            setSearchTerm("");
        }
        else if(searchTerm.includes("minCBUser"))
        {
            const response = await fetch(`http://localhost:8080/leastContributingUser`);

            const data = await response.json();
            
            navigate(`/showSearchResultUser/leastContributingUser/${username}/${data}`)
            setSearchTerm("");
        }
        else if(searchTerm.includes("User:"))
        {
            const parts = searchTerm.split(":");
            if (parts.length === 2) 
            {
                const searchUsername = parts[1].trim();
                // an API call to search content
                const response = await fetch(`http://localhost:8080/contentByUSer?searchUsername=${searchUsername}`);

                const data = await response.json();
                if(data.length === 0)
                {
                    // it means we don't have any related content in the database so just alert the user 
                    alert("No content found!");
                    setSearchTerm("");
                }
                else
                {
                    // Show the result posts list
                    // but it was giving errors when passing list in the URL so I decided to pass the search term and do the fetch call on the results page 
                    // itself and we are guranteed to have results in this approach
                    navigate(`/showUserPostList/${searchUsername}/${username}`);
                    setSearchTerm("");
                }
            } 
            else 
            {
                alert("Invalid input format");
            }
        }
        else
        {
            alert("Please search for a valid keyword");
            setSearchTerm("");
        }
    }
  }

  function handleSearchBarClick() {
    setShowSearchOptions(true);
  }

  function handleSearchBarBlur() {
    // Adding a small delay to allow the click event on search options to trigger first
    setTimeout(() => setShowSearchOptions(false), 200);
  }

  return (
    <div className='search-bar'>
      <div className="search-container">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={handleSearchBarClick}
          onBlur={handleSearchBarBlur}
          placeholder={`Search ${searchType === 'content' ? 'Content' : 'User'}`}
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      {showSearchOptions && (
        <div className="search-options">
          <label>
            <input
              type="radio"
              value="content"
              checked={searchType === 'content'}
              onChange={() => handleSearchTypeChange('content')}
            />
            Content
          </label>
          <label>
            <input
              type="radio"
              value="user"
              checked={searchType === 'user'}
              onChange={() => handleSearchTypeChange('user')}
            />
            User
          </label>
        </div>
      )}
    </div>
  );
};

export default Search;
