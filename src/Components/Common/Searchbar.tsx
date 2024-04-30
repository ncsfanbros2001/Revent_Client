import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Fragment } from "react/jsx-runtime"
import { Input, Image, Container } from "semantic-ui-react"
import '../../Stylesheets/SearchBar.css'
import axiosAgent from "../../API/axiosAgent";
import { IProfile } from "../../Interfaces/user";
import { router } from "../../router/Routes";
import { useLocation } from "react-router-dom";

const Searchbar = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [results, setResults] = useState<IProfile[]>([]);
    const [searchValue, setSearchValue] = useState('')
    const { pathname } = useLocation();

    useEffect(() => {
        setSearchValue('')
    }, [pathname])

    const handleSearchChange = async (value: string) => {
        setIsLoading(true);
        setSearchValue(value)
        await axiosAgent.ProfileActions.getAllProfiles(value)
            .then((response) => {
                setResults(response)
            })
            .catch(() => {
                toast.error('Error fetching search results');
            })
            .finally(() => {
                setIsLoading(false);
            })
    };

    return (
        <Fragment>
            <div className="search-bar-container">
                <Input
                    id='searchInput'
                    value={searchValue}
                    style={{ width: 300 }}
                    loading={isLoading}
                    type="text"
                    placeholder='Search User...'
                    icon='search'
                    onChange={(e) => handleSearchChange(e.target.value)} />

                {searchValue.length > 0 && (
                    <div className="result-list">
                        {results.length > 0 && !isLoading ? results.map((result) => (
                            <div
                                className="result-item"
                                key={result.userID}
                                onClick={() => router.navigate(`/profiles/${result.userID}`)}
                            >
                                <Image
                                    src={result.avatarURL || './public/user.png'}
                                    className="user-avatar"
                                    verticalAlign="middle"
                                    style={{ width: 50, height: 50, borderRadius: 5 }}
                                />
                                <Container className="names">
                                    <b>{result.fullname}</b>
                                    <span style={{ color: 'grey' }}>@{result.username}</span>
                                </Container>
                            </div>
                        )) : results.length === 0 && !isLoading ? (
                            <div className="result-item">
                                <b>No Result</b>
                            </div>
                        ) : null}
                    </div>
                )}
            </div>
        </Fragment>
    )
}

export default Searchbar