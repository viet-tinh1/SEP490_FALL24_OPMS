using System;
namespace Repositories.Types
{


    public record Response(
        int error,
        String message,
        object? data
    );
}